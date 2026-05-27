import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import { EditorContent, useEditor } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";
import {
  approvePost,
  getModerationQueue,
  rejectPost,
  type ModerationPost,
} from "@/api/moderation";
import styles from "./ModerationPage.module.css";

const STATUS_LABELS: Record<ModerationPost["status"], string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
};

function PostPreview({ markup }: { markup: string }): JSX.Element {
  const content = deserializeFromMarkup(markup);
  const editor = useEditor({
    editable: false,
    extensions: EDITOR_EXTENSIONS,
    content,
    editorProps: {
      attributes: { class: editorStyles.editorContent },
    },
  });

  return editor ? (
    <EditorContent editor={editor} className={styles.preview} />
  ) : (
    <div className={styles.previewFallback} />
  );
}

export default function ModerationPage(): JSX.Element {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ModerationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {},
  );

  const fetchQueue = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { posts } = await getModerationQueue();
      setPosts(posts);
    } catch {
      setMessage("We couldn't load the moderation queue right now.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchQueue();
  }, []);

  const handleApprove = async (postId: string) => {
    try {
      await approvePost(postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch {
      setMessage("We couldn't approve that post right now.");
    }
  };

  const handleReject = async (postId: string) => {
    const reason = rejectReasons[postId]?.trim();
    if (!reason) {
      setMessage("Please provide a rejection reason.");
      return;
    }

    try {
      await rejectPost(postId, reason);
      setPosts((current) => current.filter((post) => post.id !== postId));
      setRejectingId(null);
      setRejectReasons((current) => {
        const next = { ...current };
        delete next[postId];
        return next;
      });
    } catch {
      setMessage("We couldn't reject that post right now.");
    }
  };

  const handleEditRejected = (postId: string) => {
    navigate(`/posts/edit/${postId}`);
  };

  return (
    <main className={styles.main}>
      <section className={styles.shell} aria-labelledby="moderation-title">
        <header className={styles.header}>
          <div>
            <h1 id="moderation-title" className={styles.title}>
              Moderation queue
            </h1>
            <p className={styles.subtitle}>
              Review pending posts and approve or reject them before midnight.
            </p>
          </div>
          <div className={styles.headerIcon}>
            <GavelOutlined fontSize="inherit" />
          </div>
        </header>

        {loading ? (
          <p className={styles.status}>Loading moderation queue…</p>
        ) : message ? (
          <p className={styles.status}>{message}</p>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <ScheduleOutlined className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No posts to review</h2>
            <p className={styles.emptyText}>
              Everything in the queue has been handled for now.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {posts.map((post) => {
              const createdAt = new Date(post.createdAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              );
              const isRejecting = rejectingId === post.id;

              return (
                <article key={post.id} className={styles.card}>
                  <header className={styles.cardHeader}>
                    <div className={styles.authorBlock}>
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.displayName}
                          className={styles.avatar}
                        />
                      ) : (
                        <img
                          src="/assets/avatar.svg"
                          alt=""
                          aria-hidden="true"
                          className={styles.avatar}
                        />
                      )}
                      <div className={styles.authorCopy}>
                        <strong>{post.author.displayName}</strong>
                        <span>@{post.author.username}</span>
                      </div>
                    </div>

                    <div className={styles.metaRow}>
                      <span
                        className={`${styles.badge} ${styles[`status_${post.status}`]}`}
                      >
                        {post.status === "PENDING" ? (
                          <AutoAwesomeOutlined fontSize="inherit" />
                        ) : post.status === "APPROVED" ? (
                          <CheckCircleOutlineOutlined fontSize="inherit" />
                        ) : post.status === "REJECTED" ? (
                          <ErrorOutlineOutlined fontSize="inherit" />
                        ) : (
                          <ScheduleOutlined fontSize="inherit" />
                        )}
                        {STATUS_LABELS[post.status]}
                      </span>
                      <span className={styles.createdAt}>
                        Submitted {createdAt}
                      </span>
                    </div>
                  </header>

                  <PostPreview markup={post.markup} />

                  <div className={styles.tagRow}>
                    {post.tags.map((tag) => (
                      <span key={tag.id} className={styles.tag}>
                        #{tag.name}
                      </span>
                    ))}
                  </div>

                  {isRejecting ? (
                    <div className={styles.rejectBox}>
                      <label
                        className={styles.rejectLabel}
                        htmlFor={`reason-${post.id}`}
                      >
                        Rejection reason
                      </label>
                      <textarea
                        id={`reason-${post.id}`}
                        className={styles.rejectInput}
                        rows={3}
                        value={rejectReasons[post.id] ?? ""}
                        onChange={(event) =>
                          setRejectReasons((current) => ({
                            ...current,
                            [post.id]: event.target.value,
                          }))
                        }
                        placeholder="Contains promotional content"
                      />
                    </div>
                  ) : null}

                  <div className={styles.actions}>
                    {post.status === "REJECTED" ? (
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleEditRejected(post.id)}
                      >
                        <EditOutlined fontSize="inherit" />
                        Edit and resend
                      </button>
                    ) : null}

                    <button
                      type="button"
                      className={styles.approveButton}
                      onClick={() => void handleApprove(post.id)}
                    >
                      <CheckCircleOutlineOutlined fontSize="inherit" />
                      Approve
                    </button>

                    {isRejecting ? (
                      <>
                        <button
                          type="button"
                          className={styles.rejectButton}
                          onClick={() => void handleReject(post.id)}
                        >
                          <ErrorOutlineOutlined fontSize="inherit" />
                          Reject
                        </button>
                        <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={() => setRejectingId(null)}
                        >
                          <CloseOutlined fontSize="inherit" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className={styles.rejectButton}
                        onClick={() => setRejectingId(post.id)}
                      >
                        <ErrorOutlineOutlined fontSize="inherit" />
                        Reject
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
