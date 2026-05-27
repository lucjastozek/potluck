import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { getConversations, type Conversation } from "@/api/conversations";
import { useAuth } from "@/context/AuthContext";
import { getAvatarHueRotation } from "@/utils/avatarHue";
import styles from "./InboxPage.module.css";

function getConversationTitle(
  conversation: Conversation,
  userId?: string,
): string {
  const otherParticipants = conversation.participants
    .map((participant) => participant.user)
    .filter((participant) => participant.id !== userId);

  if (otherParticipants.length === 0) {
    return "Conversation";
  }

  if (otherParticipants.length === 1) {
    return otherParticipants[0].displayName;
  }

  return otherParticipants
    .map((participant) => participant.displayName)
    .join(", ");
}

function getConversationPreview(conversation: Conversation): string {
  const message = conversation.messages[0];
  if (!message) return "No messages yet.";
  if (message.sharedPost) return "Shared a post";
  return message.body ?? "No text message";
}

export default function InboxPage(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { conversations } = await getConversations();
        if (active) {
          setConversations(conversations);
        }
      } catch {
        if (active) {
          setError("We couldn't load your conversations right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.shell} aria-labelledby="inbox-title">
        <header className={styles.header}>
          <div>
            <h1 id="inbox-title" className={styles.title}>
              Messages
            </h1>
            <p className={styles.subtitle}>
              Conversations and shared posts appear here.
            </p>
          </div>
        </header>

        {loading ? (
          <p className={styles.status}>Loading messages…</p>
        ) : error ? (
          <p className={styles.status}>{error}</p>
        ) : conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <ChatBubbleOutlineOutlined className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No conversations yet</h2>
            <p className={styles.emptyText}>
              When someone sends you a message or shares a post, it will show up
              here.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {conversations.map((conversation) => {
              const otherParticipants = conversation.participants
                .map((participant) => participant.user)
                .filter((participant) => participant.id !== user?.id);
              const title = getConversationTitle(conversation, user?.id);
              const preview = getConversationPreview(conversation);
              const avatar = otherParticipants[0];
              const avatarHue = avatar
                ? getAvatarHueRotation(avatar.username)
                : "0";

              return (
                <button
                  key={conversation.id}
                  type="button"
                  className={styles.card}
                  onClick={() => navigate(`/messages/${conversation.id}`)}
                >
                  {avatar ? (
                    avatar.avatarUrl ? (
                      <img
                        src={avatar.avatarUrl}
                        alt={avatar.displayName}
                        className={styles.avatar}
                      />
                    ) : (
                      <img
                        src="/assets/avatar.svg"
                        alt=""
                        aria-hidden="true"
                        className={styles.avatar}
                        style={{ filter: `hue-rotate(${avatarHue})` }}
                      />
                    )
                  ) : (
                    <div className={styles.avatarFallback}>
                      {title.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className={styles.copy}>
                    <div className={styles.row}>
                      <strong className={styles.name}>{title}</strong>
                      <span className={styles.time}>
                        {conversation.messages[0]
                          ? new Date(
                              conversation.messages[0].createdAt,
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p className={styles.preview}>{preview}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
