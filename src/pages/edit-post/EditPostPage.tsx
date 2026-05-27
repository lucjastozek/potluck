import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import { EditorContent, useEditor } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";
import { deletePost, getMyPosts, submitPost, updatePost } from "@/api/posts";
import type { MyPost } from "@/api/posts";
import PostEditor from "@/components/editor/PostEditor";
import styles from "./EditPostPage.module.css";

type EditablePost = Pick<
  MyPost,
  "id" | "markup" | "status" | "updatedAt" | "tags"
>;

function ReadOnlyPreview({ markup }: { markup: string }): JSX.Element {
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

const STATUS_COPY: Record<MyPost["status"], string> = {
  DRAFT: "Drafts can still be updated before they go to review.",
  PENDING: "This post is currently under review.",
  APPROVED:
    "This post was approved, but you can still edit it and send it back through review.",
  REJECTED:
    "This post was rejected previously. Saving updates it and backend resets it to draft.",
  PUBLISHED:
    "Published posts are read-only here. You can delete them if needed.",
};

export default function EditPostPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<EditablePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadPost = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const { posts } = await getMyPosts();
        const found = posts.find((candidate) => candidate.id === id);
        if (!found) {
          if (active) {
            navigate("/posts/drafts", { replace: true });
          }
          return;
        }
        if (active) {
          setPost({
            id: found.id,
            markup: found.markup,
            status: found.status,
            updatedAt: found.updatedAt,
            tags: found.tags,
          });
        }
      } catch {
        if (active) {
          setError("We couldn't load that post right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/posts/drafts");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navigate]);

  const handleClose = () => {
    navigate("/posts/drafts");
  };

  const handleDelete = async () => {
    if (!id || !post) return;

    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      await deletePost(id);
      navigate("/posts/drafts");
    } catch {
      setError("We couldn't delete that post right now.");
    }
  };

  const handleSubmit = async (markup: string) => {
    if (!id || !post) return;

    try {
      await updatePost(id, { markup });

      if (post.status === "DRAFT" || post.status === "APPROVED") {
        await submitPost(id);
      }

      navigate("/posts/drafts");
    } catch {
      setError("We couldn't save that post right now.");
    }
  };

  if (loading) {
    return (
      <main className={styles.screen}>
        <div className={styles.backdrop} />
        <section className={styles.card} aria-label="Loading post editor">
          <p className={styles.loadingText}>Loading editor…</p>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className={styles.screen}>
        <div className={styles.backdrop} />
        <section className={styles.card} aria-label="Post not found">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Post not found</h1>
              <p className={styles.subtitle}>
                The post you tried to edit could not be loaded.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClose}
            >
              <CloseRounded fontSize="inherit" />
              Close
            </button>
          </div>
        </section>
      </main>
    );
  }

  const statusIcon =
    post.status === "DRAFT" ? (
      <ScheduleOutlined fontSize="inherit" />
    ) : post.status === "PENDING" ? (
      <AutoAwesomeOutlined fontSize="inherit" />
    ) : post.status === "APPROVED" ? (
      <CheckCircleOutlineOutlined fontSize="inherit" />
    ) : post.status === "REJECTED" ? (
      <ErrorOutlineOutlined fontSize="inherit" />
    ) : (
      <CheckCircleOutlineOutlined fontSize="inherit" />
    );

  return (
    <main className={styles.screen}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close editor"
        onClick={handleClose}
      />

      <section
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Edit post"
      >
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            <div className={styles.badgeRow}>
              <span
                className={`${styles.badge} ${styles[`status_${post.status}`]}`}
              >
                {statusIcon}
                <span>{post.status}</span>
              </span>
              <span className={styles.metaText}>
                Updated {new Date(post.updatedAt).toLocaleString()}
              </span>
            </div>
            <h1 className={styles.title}>Edit post</h1>
            <p className={styles.subtitle}>
              {post.status === "PUBLISHED"
                ? "Published posts are read-only. You can delete the post, but you can't edit it anymore."
                : post.status === "REJECTED"
                  ? "Rejected posts are updated in place and reset to draft by backend rules."
                  : "Save changes here and the post will go back through review if it was approved."}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <CloseRounded fontSize="inherit" />
            Close
          </button>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.note}>
          <EditOutlined fontSize="inherit" />
          <span>{STATUS_COPY[post.status]}</span>
        </div>

        {post.status === "PUBLISHED" ? (
          <>
            <ReadOnlyPreview markup={post.markup} />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={handleDelete}
              >
                <DeleteOutline fontSize="inherit" />
                Delete post
              </button>
            </div>
          </>
        ) : (
          <PostEditor
            onSubmit={handleSubmit}
            initialMarkup={post.markup}
            submitLabel="Save changes"
          />
        )}
      </section>
    </main>
  );
}
