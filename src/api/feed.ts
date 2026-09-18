import { api } from "./client";

export interface Tag {
  id: string;
  name: string;
}

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface FeedPost {
  id: string;
  markup: string;
  createdAt: string;
  publishedAt: string;
  author: PostAuthor;
  tags: Tag[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface DailyFeed {
  id: string;
  date: string;
  posts: FeedPost[];
}

export async function getTodayFeed(): Promise<{
  feed: DailyFeed | null;
  message?: string;
}> {
  return api.get("/api/feed/today");
}

export async function getArchiveFeed(
  date: string,
): Promise<{ feed: DailyFeed }> {
  return api.get(`/api/feed/${date}`);
}

export async function getPostById(postId: string): Promise<{ post: FeedPost }> {
  return api.get(`/api/posts/${postId}`);
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  author: PostAuthor;
  _count: { replies: number };
}

export async function getComments(
  postId: string,
): Promise<{ comments: Comment[] }> {
  return api.get(`/api/posts/${postId}/comments`);
}

export async function addComment(
  postId: string,
  body: string,
  parentId?: string,
): Promise<{ comment: Comment }> {
  return api.post(`/api/posts/${postId}/comments`, { body, parentId });
}

export async function deleteComment(
  postId: string,
  commentId: string,
): Promise<void> {
  return api.delete(`/api/posts/${postId}/comments/${commentId}`);
}

export async function toggleLike(
  postId: string,
): Promise<{ liked: boolean; likeCount: number }> {
  return api.post(`/api/posts/${postId}/like`);
}
