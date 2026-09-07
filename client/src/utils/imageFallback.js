export const fallbackUserAvatar = "/avatars/user.svg";
export const fallbackChannelAvatar = "/avatars/channel.svg";
export const fallbackThumbnail =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23eeeeee'/%3E%3Cpath d='M278 224V136l92 44-92 44Z' fill='%23cc0000'/%3E%3Ctext x='320' y='285' text-anchor='middle' font-family='Arial' font-size='26' fill='%23606060'%3EVideo thumbnail%3C/text%3E%3C/svg%3E";

export const useFallbackUserAvatar = (event) => {
  if (event.currentTarget.src.endsWith(fallbackUserAvatar)) return;
  event.currentTarget.src = fallbackUserAvatar;
};

export const useFallbackChannelAvatar = (event) => {
  if (event.currentTarget.src.endsWith(fallbackChannelAvatar)) return;
  event.currentTarget.src = fallbackChannelAvatar;
};

export const useFallbackThumbnail = (event) => {
  if (event.currentTarget.src === fallbackThumbnail) return;
  event.currentTarget.src = fallbackThumbnail;
};
