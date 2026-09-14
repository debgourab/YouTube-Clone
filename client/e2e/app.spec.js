import { test, expect } from "@playwright/test";

const channel = { _id: "channel1", channelName: "Test Creator", subscribers: 12, avatar: "/avatars/channel.svg" };
const video = { _id: "video1", title: "Uploaded browser video", videoUrl: "https://media.example/sample.webm",
  thumbnailUrl: "/avatars/channel.svg", description: "A video created for browser playback testing.", channelId: channel,
  views: 12, likes: 0, dislikes: 0, viewerReaction: "", createdAt: "2026-09-01T00:00:00Z" };

async function mockApi(page) {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/auth/me") return route.fulfill({ json: { user: { id: "user1", username: "Tester" } } });
    if (url.pathname === "/api/channels/mine") return route.fulfill({ json: [channel] });
    if (url.pathname === "/api/channels/channel1") return route.fulfill({ json: { channel, videos: [video] } });
    if (url.pathname === "/api/videos" && route.request().method() === "POST") return route.fulfill({ status: 201, json: { ...video, ...route.request().postDataJSON(), _id: "newvideo", channelId: channel } });
    if (url.pathname === "/api/videos") return route.fulfill({ json: [video] });
    if (url.pathname.includes("/like")) return route.fulfill({ json: { likes: 1, dislikes: 0, viewerReaction: "like" } });
    const item = url.pathname.endsWith("/video2") ? { ...video, _id: "video2", title: "YouTube example", videoUrl: "https://youtu.be/dQw4w9WgXcQ" } : video;
    return route.fulfill({ json: { video: item, comments: [], related: [{ ...video, _id: "video2", title: "YouTube example" }] } });
  });
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<p>Embedded player</p>" }));
}

test.beforeEach(async ({ page }) => { await mockApi(page); });

test("watch menu opens, traps focus, closes with Escape and navigates", async ({ page }) => {
  await page.goto("/watch/video1");
  await expect(page.getByRole("heading", { name: video.title })).toBeVisible();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const drawer = page.getByRole("dialog", { name: "Main navigation" });
  await expect(drawer).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.getByRole("link", { name: "News", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Toggle sidebar" })).toBeFocused();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await drawer.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("registration gives all password rules and blocks weak submissions", async ({ page }) => {
  let submitted = false;
  await page.route("**/api/auth/register", (route) => { submitted = true; return route.fulfill({ status: 201, json: { user: {} } }); });
  await page.goto("/auth");
  await page.getByRole("button", { name: "New here? Create an account" }).click();
  await page.getByLabel("Username", { exact: true }).fill("Tester");
  await page.getByLabel("Email", { exact: true }).fill("tester@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  expect(submitted).toBe(false);
  await page.getByLabel("Password", { exact: true }).fill("StrongPass1!");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByText("Account created. Sign in to get started.")).toBeVisible();
  expect(submitted).toBe(true);
});

test("YouTube navigation replaces the direct media player", async ({ page }) => {
  await page.goto("/watch/video1");
  await expect(page.getByRole("heading", { name: video.title })).toBeVisible();
  await page.getByRole("link", { name: /YouTube example/ }).click();
  await expect(page.locator("iframe.player")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  await expect(page.locator("video.player")).toHaveCount(0);
});

test("failed media shows an actionable retry", async ({ page }) => {
  await page.route("https://media.example/**", (route) => route.fulfill({ status: 404, body: "" }));
  await page.goto("/watch/video1");
  await expect(page.getByText("We couldn’t play this video")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open original video" })).toHaveAttribute("href", video.videoUrl);
});

test("direct uploaded media actually plays in the browser", async ({ page }) => {
  // Make a tiny real WebM fixture instead of depending on a third-party CDN.
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160; canvas.height = 90;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(15);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const complete = new Promise((resolve) => { recorder.onstop = resolve; });
    recorder.start();
    const timer = setInterval(() => { ctx.fillStyle = "#e6002d"; ctx.fillRect(0, 0, 160, 90); }, 50);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    recorder.stop();
    await complete;
    clearInterval(timer);
    stream.getTracks().forEach((track) => track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks, { type: "video/webm" }).arrayBuffer()));
  });
  await page.route("https://media.example/**", (route) => route.fulfill({ contentType: "video/webm", body: Buffer.from(bytes) }));
  await page.goto("/watch/video1");
  const player = page.locator("video.player");
  await expect.poll(() => player.evaluate((node) => node.readyState)).toBeGreaterThanOrEqual(2);
  await player.evaluate((node) => { node.muted = true; return node.play(); });
  await expect.poll(() => player.evaluate((node) => node.currentTime)).toBeGreaterThan(0);
});

test("studio validates links, publishes metadata and keeps channel identity after reactions", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("yt_token", "test-token"));
  await page.goto("/studio");
  await page.getByLabel("Title", { exact: true }).fill("My new upload");
  await page.getByLabel("Thumbnail URL", { exact: true }).fill("https://example.com/thumbnail.jpg");
  await page.getByLabel("Video URL", { exact: true }).fill("https://example.com/not-video");
  await page.locator(".wide").getByLabel("Description", { exact: true }).fill("A newly published example video.");
  await page.getByRole("button", { name: "Add video", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("public MP4");
  await page.getByLabel("Video URL", { exact: true }).fill("https://media.example/sample.webm");
  await page.getByRole("button", { name: "Add video", exact: true }).click();
  await expect(page.getByRole("heading", { name: "My new upload" })).toBeVisible();
  await page.goto("/watch/video1");
  await page.getByRole("button", { name: "Like video", exact: true }).click();
  await expect(page.getByRole("button", { name: "Like video", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /Test Creator/ }).first()).toHaveAttribute("href", "/channel/channel1");
});
