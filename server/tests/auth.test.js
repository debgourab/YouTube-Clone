import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

test("registration rejects weak and malformed passwords before accessing the database", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const url = "http://127.0.0.1:" + server.address().port + "/api/auth/register";
    for (const password of ["password123", "ALLUPPER1!", "NoNumber!", "NoSpecial1", { invalid: true }]) {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Tester", email: "tester@example.com", password }) });
      assert.equal(response.status, 400);
      assert.match((await response.json()).message, /Password|uppercase/i);
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
