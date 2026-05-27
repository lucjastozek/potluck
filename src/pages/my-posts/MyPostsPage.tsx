import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import { EditorContent, useEditor } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";
import { deletePost, getMyPosts } from "@/api/posts";
import type { MyPost } from "@/api/posts";
import styles from "./MyPostsPage.module.css";

const STATUS_LABELS: Record<MyPost["status"], string> = {
  DRAFT: "Draft",
  PENDING: "In review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
};

export default function MyPostsPage(): JSX.Element {
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const fetchPosts = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await getMyPosts();
      setPosts(res.posts);
    } catch {
      setMessage("We couldn't load your posts right now.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch {
      setMessage("We couldn't delete that post right now.");
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.shell} aria-labelledby="my-posts-title">
        <header className={styles.header}>
          <div>
            <h1 id="my-posts-title" className={styles.title}>
              My posts
            </h1>
            <p className={styles.subtitle}>
              Review drafts, track moderation status, and edit anything that
              isn't published yet. Saving an edit sends it back through review
              when needed.
            </p>
          </div>

          <button
            type="button"
            className={styles.newButton}
            onClick={() => navigate("/feed?compose=1")}
          >
            New post
          </button>
        </header>

        {loading ? (
          <p className={styles.statusText}>Loading your posts…</p>
        ) : message ? (
          <p className={styles.statusText}>{message}</p>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No posts yet</h2>
            <p className={styles.emptyText}>
              Drafts you save will appear here so you can keep editing them,
              update them, and see whether they were approved, rejected, or
              published.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {posts.map((post) => {
              const canEdit =
                post.status === "DRAFT" ||
                post.status === "PENDING" ||
                post.status === "APPROVED" ||
                post.status === "REJECTED";
              const createdAt = new Date(post.createdAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              );
              const updatedAt = new Date(post.updatedAt).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              );

              return (
                <article key={post.id} className={styles.card}>
                  <header className={styles.cardHeader}>
                    <div className={styles.headerCopy}>
                      <div className={styles.badgeRow}>
                        <span
                          className={`${styles.badge} ${styles[`status_${post.status}`]}`}
                        >
                          {post.status === "DRAFT" ? (
                            <ScheduleOutlined fontSize="inherit" />
                          ) : post.status === "PENDING" ? (
                            <AutoAwesomeOutlined fontSize="inherit" />
                          ) : post.status === "APPROVED" ? (
                            <CheckCircleOutlineOutlined fontSize="inherit" />
                          ) : post.status === "REJECTED" ? (
                            <ErrorOutlineOutlined fontSize="inherit" />
                          ) : (
                            <CheckCircleOutlineOutlined fontSize="inherit" />
                          )}
                          <span>{STATUS_LABELS[post.status]}</span>
                        </span>
                        <span className={styles.metaText}>
                          Created {createdAt}
                        </span>
                      </div>
                      <p className={styles.updatedText}>Updated {updatedAt}</p>
                    </div>

                    <div className={styles.cardActions}>
                      {canEdit ? (
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => handleEdit(post.id)}
                        >
                          <EditOutlined fontSize="inherit" />
                          Edit
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className={`${styles.ghostButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(post.id)}
                      >
                        <DeleteOutline fontSize="inherit" />
                        Delete
                      </button>
                    </div>
                  </header>

                  <PostPreview markup={post.markup} />

                  {post.status === "REJECTED" && post.rejectReason ? (
                    <div className={styles.rejectionBox}>
                      <strong>Rejection reason</strong>
                      <p>{post.rejectReason}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
