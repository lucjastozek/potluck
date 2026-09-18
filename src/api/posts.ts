import { api } from "./client";

export type PostStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export interface MyPost {
  id: string;
  markup: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  rejectReason: string | null;
  tags: { id: string; name: string }[];
}

export async function getMyPosts(): Promise<{ posts: MyPost[] }> {
  return api.get("/api/posts");
}

export async function createPost(
  markup: string,
  tags: string[],
): Promise<{ post: MyPost }> {
  return api.post("/api/posts", { markup, tags });
}

export async function updatePost(
  id: string,
  data: { markup?: string; tags?: string[] },
): Promise<{ post: MyPost }> {
  return api.patch(`/api/posts/${id}`, data);
}

export async function submitPost(id: string): Promise<{ post: MyPost }> {
  return api.post(`/api/posts/${id}/submit`);
}

export async function deletePost(id: string): Promise<void> {
  return api.delete(`/api/posts/${id}`);
}
