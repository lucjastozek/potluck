import { useState, useEffect, useCallback } from "react";
import { getNotifications, markAllRead, markRead } from "@/api/notifications";
import type { Notification } from "@/api/notifications";

const POLL_INTERVAL = 60_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { notifications, unreadCount } = await getNotifications();
      setNotifications(notifications);
      setUnreadCount(unreadCount);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetch]);

  const readAll = useCallback(async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const read = useCallback(async (id: string) => {
    await markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  return { notifications, unreadCount, loading, readAll, read, refetch: fetch };
}
