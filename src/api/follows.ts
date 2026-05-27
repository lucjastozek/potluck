import { api } from "./client";
import type { PostAuthor } from "./feed";

export async function toggleFollow(username: string): Promise<{ following: boolean }> {
  return api.post(`/api/users/${username}/follow`);
}

export async function getFollowers(username: string): Promise<{ followers: PostAuthor[] }> {
  return api.get(`/api/users/${username}/followers`);
}

export async function getFollowing(username: string): Promise<{ following: PostAuthor[] }> {
  return api.get(`/api/users/${username}/following`);
}
