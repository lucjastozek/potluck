import { api } from "./client";
import type { PostAuthor, FeedPost } from "./feed";

export interface Message {
  id: string;
  body: string | null;
  createdAt: string;
  sender: PostAuthor;
  sharedPost: (FeedPost & { author: PostAuthor }) | null;
}

export interface Conversation {
  id: string;
  createdAt: string;
  participants: { user: PostAuthor }[];
  messages: Message[];
}

export async function getConversations(): Promise<{
  conversations: Conversation[];
}> {
  return api.get("/api/conversations");
}

export async function startConversation(
  userId: string,
): Promise<{ conversation: Conversation }> {
  return api.post("/api/conversations", { userId });
}

export async function getMessages(
  conversationId: string,
): Promise<{ messages: Message[] }> {
  return api.get(`/api/conversations/${conversationId}/messages`);
}

export async function sendMessage(
  conversationId: string,
  body?: string,
  sharedPostId?: string,
): Promise<{ message: Message }> {
  return api.post(`/api/conversations/${conversationId}/messages`, {
    body,
    sharedPostId,
  });
}
