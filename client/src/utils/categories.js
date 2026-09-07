export const categories = [
  "All",
  "Web Development",
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "Programming",
  "Music",
  "Gaming",
  "News"
];

export const videoCategories = categories.filter((category) => category !== "All");

export const formatViews = (views = 0) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

export const formatDate = (value) => {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};
