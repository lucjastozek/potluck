import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SendRounded from "@mui/icons-material/SendRounded";
import { getMessages, sendMessage, type Message } from "@/api/conversations";
import { useAuth } from "@/context/AuthContext";
import { formatTimestamp } from "@/utils/formatTimestamp";
import Renderer from "@/components/renderer/Renderer";
import styles from "./ConversationPage.module.css";

export default function ConversationPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/messages", { replace: true });
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { messages } = await getMessages(id);
        if (active) {
          setMessages(messages);
        }
      } catch {
        if (active) {
          setError("We couldn't load that conversation right now.");
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
  }, [id, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !body.trim()) return;

    setSending(true);
    setError(null);

    try {
      const { message } = await sendMessage(id, body.trim());
      setMessages((current) => [...current, message]);
      setBody("");
    } catch {
      setError("We couldn't send that message right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.shell} aria-labelledby="conversation-title">
        <header className={styles.header}>
          <div>
            <h1 id="conversation-title" className={styles.title}>
              Conversation
            </h1>
            <p className={styles.subtitle}>Direct messages and shared posts.</p>
          </div>
        </header>

        {loading ? (
          <p className={styles.status}>Loading conversation…</p>
        ) : error ? (
          <p className={styles.status}>{error}</p>
        ) : (
          <div className={styles.thread}>
            {messages.map((message) => {
              const isMine = message.sender.id === user?.id;
              return (
                <article
                  key={message.id}
                  className={`${styles.message} ${isMine ? styles.messageMine : styles.messageTheirs}`}
                >
                  <div className={styles.messageMeta}>
                    <strong>{message.sender.displayName}</strong>
                    <span>{formatTimestamp(message.createdAt)}</span>
                  </div>

                  {message.body ? (
                    <p className={styles.body}>{message.body}</p>
                  ) : null}

                  {message.sharedPost ? (
                    <div className={styles.sharedPost}>
                      <Renderer markup={message.sharedPost.markup} />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.input}
            placeholder="Write a message"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            disabled={sending || loading}
          />

          <button
            type="submit"
            className={styles.sendButton}
            disabled={sending || loading || !body.trim()}
          >
            <SendRounded fontSize="inherit" />
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
