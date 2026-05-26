import { api } from "./client";
import type { User } from "./auth";

export interface Post {
  id: string;
  markup: string;
  createdAt: string;
  author: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: Pick<User, "id" | "displayName" | "avatarUrl">;
}

export async function getFeed(page = 1, limit = 20) {
  return api.get<{ posts: Post[]; total: number; page: number; limit: number }>(
    `/api/posts?page=${page}&limit=${limit}`,
  );
}

export async function createPost(markup: string): Promise<Post> {
  return api.post<Post>("/api/posts", { markup });
}

export async function deletePost(postId: string): Promise<void> {
  return api.delete(`/api/posts/${postId}`);
}

export async function toggleLike(
  postId: string,
): Promise<{ liked: boolean; likeCount: number }> {
  return api.post(`/api/posts/${postId}/likes`);
}

export async function getComments(postId: string, page = 1) {
  return api.get<{ comments: Comment[]; total: number }>(
    `/api/posts/${postId}/comments?page=${page}`,
  );
}

export async function addComment(
  postId: string,
  body: string,
): Promise<Comment> {
  return api.post<Comment>(`/api/posts/${postId}/comments`, { body });
}

export async function deleteComment(
  postId: string,
  commentId: string,
): Promise<void> {
  return api.delete(`/api/posts/${postId}/comments/${commentId}`);
}
