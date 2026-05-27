import { api } from "./client";
import type { PostAuthor } from "./feed";

export type NotificationType =
  | "NEW_FEED"
  | "COMMENT_REPLY"
  | "COMMENT_ON_POST"
  | "POST_LIKED"
  | "NEW_FOLLOWER"
  | "DM_RECEIVED"
  | "POST_SHARED"
  | "POST_APPROVED"
  | "POST_REJECTED";

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  postId: string | null;
  conversationId?: string | null;
  actor?: PostAuthor | null;
  comment: {
    id: string;
    body: string;
    postId: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
  } | null;
}

export async function getNotifications(): Promise<{
  notifications: Notification[];
  unreadCount: number;
}> {
  return api.get("/api/notifications");
}

export async function markAllRead(): Promise<void> {
  return api.post("/api/notifications/read-all");
}

export async function markRead(id: string): Promise<void> {
  return api.post(`/api/notifications/${id}/read`);
}
