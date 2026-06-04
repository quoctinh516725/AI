export const PostStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];