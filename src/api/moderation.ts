import { api } from "./client";
import type { PostAuthor } from "./feed";
import type { MyPost } from "./posts";

export interface ModerationPost
  extends Pick<MyPost, "id" | "markup" | "status" | "createdAt" | "tags"> {
  author: PostAuthor;
}

export async function getModerationQueue(): Promise<{
  posts: ModerationPost[];
}> {
  return api.get("/api/moderation/queue");
}

export async function approvePost(postId: string): Promise<void> {
  return api.post(`/api/moderation/${postId}/approve`);
}

export async function rejectPost(
  postId: string,
  reason: string,
): Promise<void> {
  return api.post(`/api/moderation/${postId}/reject`, { reason });
}
