import styles from "@/components/feed/PostCard.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikedIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Message";
import {
  addComment,
  getComments,
  FeedPost,
  type Comment as ApiComment,
  toggleLike,
} from "@/api/feed";
import { getAvatarHueClass } from "@/utils/avatarHue";
import { formatDate } from "@/utils/formatTimestamp";
import { useAuth } from "@/context/AuthContext";
import { buildCommentTree } from "@/utils/buildCommentTree";
import CommentList from "@/components/feed/CommentList";
import SendOutlined from "@mui/icons-material/SendOutlined";

interface Props {
  post: FeedPost;
  isNotificationTarget?: boolean;
  targetCommentId?: string | null;
}

export default function PostCard({
  post,
  isNotificationTarget = false,
  targetCommentId = null,
}: Props): JSX.Element {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const createdAt = formatDate(post.createdAt);
  const postAvatarClass = getAvatarHueClass(post.author.username);

  const content = deserializeFromMarkup(post.markup);
  const editor = useEditor({
    editable: false,
    extensions: EDITOR_EXTENSIONS,
    content,
    editorProps: {
      attributes: { class: editorStyles.editorContent },
    },
  });

  useEffect(() => {
    if (!isCommentsOpen || hasLoadedComments) {
      return;
    }

    let isActive = true;

    setIsLoadingComments(true);
    setCommentError(null);

    getComments(post.id)
      .then(({ comments }) => {
        if (!isActive) return;

        setComments(comments);
        setHasLoadedComments(true);
      })
      .catch(() => {
        if (!isActive) return;

        setCommentError("We couldn't load comments right now.");
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingComments(false);
      });

    return () => {
      isActive = false;
    };
  }, [hasLoadedComments, isCommentsOpen, post.id]);

  useEffect(() => {
    if (!isNotificationTarget) {
      return;
    }

    if (targetCommentId) {
      setIsCommentsOpen(true);
    }

    const frame = window.requestAnimationFrame(() => {
      articleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isNotificationTarget, targetCommentId]);

  useEffect(() => {
    if (!isNotificationTarget || !targetCommentId || !isCommentsOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const target = articleRef.current?.querySelector(
        `[data-comment-id="${targetCommentId}"]`,
      ) as HTMLElement | null;
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [
    comments.length,
    hasLoadedComments,
    isCommentsOpen,
    isNotificationTarget,
    targetCommentId,
  ]);

  const handleLike = async () => {
    const { liked } = await toggleLike(post.id);
    setLiked(liked);
  };

  const handleToggleComments = () => {
    setIsCommentsOpen((open) => !open);
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedBody = commentBody.trim();
    if (!trimmedBody || !user) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const { comment } = await addComment(post.id, trimmedBody);
      setComments((current) => [...current, comment]);
      setCommentCount((current) => current + 1);
      setCommentBody("");
      setHasLoadedComments(true);
      setIsCommentsOpen(true);
    } catch {
      setCommentError("We couldn't post your comment right now.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <article ref={articleRef} className={styles.card} data-post-id={post.id}>
      <header className={styles.header}>
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
            className={`${styles.avatar} ${styles[postAvatarClass as keyof typeof styles] ?? ""}`}
          />
        )}

        <div className={styles.meta}>
          <h4 className={styles.author}>{post.author.displayName}</h4>
          <div className={styles.date}>
            @{post.author.username} •{" "}
            <time dateTime={post.createdAt}>{createdAt}</time>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {editor ? <EditorContent editor={editor} /> : null}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={handleLike}
          aria-pressed={liked}
        >
          {liked ? (
            <LikedIcon fontSize="inherit" className={styles.liked} />
          ) : (
            <LikeIcon fontSize="inherit" />
          )}
          <span className={liked ? styles.liked : ""}>
            {liked ? "Liked" : "Like"}
          </span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleToggleComments}
          aria-expanded={isCommentsOpen}
        >
          <CommentIcon fontSize="inherit" />
          <span>Comment{commentCount > 0 ? ` (${commentCount})` : ""}</span>
        </button>
      </div>

      {isCommentsOpen ? (
        <section className={styles.comments} aria-label="Comments">
          {commentError ? (
            <p className={styles.commentStatus}>{commentError}</p>
          ) : null}

          {isLoadingComments ? (
            <p className={styles.commentStatus}>Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className={styles.commentStatus}>
              No comments yet. Be the first to say something.
            </p>
          ) : (
            <CommentList
              nodes={buildCommentTree(comments)}
              postId={post.id}
              targetCommentId={targetCommentId}
              onAdd={(c) => {
                setComments((cur) => [...cur, c]);
                setCommentCount((n) => n + 1);
              }}
              onDelete={(id) => {
                setComments((cur) => {
                  const toRemove = new Set<string>([id]);
                  let added = true;
                  while (added) {
                    added = false;
                    for (const cm of cur) {
                      if (
                        cm.parentId &&
                        toRemove.has(cm.parentId) &&
                        !toRemove.has(cm.id)
                      ) {
                        toRemove.add(cm.id);
                        added = true;
                      }
                    }
                  }

                  return cur.filter((c) => !toRemove.has(c.id));
                });
                setCommentCount((n) => Math.max(0, n - 1));
              }}
            />
          )}

          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <textarea
              className={styles.commentInput}
              placeholder={
                user ? "Write a comment" : "Sign in to post a comment"
              }
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              rows={3}
              disabled={!user || isSubmittingComment}
            />

            <div className={styles.commentFormFooter}>
              {!user ? (
                <p className={styles.commentHint}>
                  You need to sign in before posting comments.
                </p>
              ) : (
                <p className={styles.commentHint}>
                  Comments are shared with everyone in the feed.
                </p>
              )}

              <button
                type="submit"
                className={`${styles.pillButton} ${styles.pillPrimary}`}
                disabled={!user || isSubmittingComment || !commentBody.trim()}
              >
                <span className={styles.pillIcon}>
                  <SendOutlined fontSize="inherit" />
                </span>
                {isSubmittingComment ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </article>
  );
}
