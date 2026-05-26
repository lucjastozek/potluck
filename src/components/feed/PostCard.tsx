import styles from "@/components/feed/PostCard.module.css";
import { FormEvent, useEffect, useState } from "react";
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
  Post,
  type Comment,
  toggleLike,
} from "@/api/posts";
import { getAvatarHueRotation } from "@/utils/avatarHue";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { useAuth } from "@/context/AuthContext";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props): JSX.Element {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const createdAt = formatTimestamp(post.createdAt);
  const postAvatarHue = getAvatarHueRotation(post.author.username);

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
      const comment = await addComment(post.id, trimmedBody);
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
    <article className={styles.card}>
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
            className={styles.avatar}
            style={{ filter: `hue-rotate(${postAvatarHue})` }}
          />
        )}

        <div className={styles.meta}>
          <h4 className={styles.author}>{post.author.displayName}</h4>
          <div className={styles.date}>
            {post.author.username} •{" "}
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
            <ul className={styles.commentList}>
              {comments.map((comment) => {
                const commentCreatedAt = formatTimestamp(comment.createdAt);
                const commentAvatarSeed =
                  comment.author.username ?? comment.author.displayName;
                const commentAvatarHue =
                  getAvatarHueRotation(commentAvatarSeed);

                return (
                  <li key={comment.id} className={styles.commentItem}>
                    {comment.author.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.displayName}
                        className={styles.commentAvatar}
                      />
                    ) : (
                      <img
                        src="/assets/avatar.svg"
                        alt=""
                        aria-hidden="true"
                        className={styles.commentAvatar}
                        style={{ filter: `hue-rotate(${commentAvatarHue})` }}
                      />
                    )}

                    <div className={styles.commentBody}>
                      <div className={styles.commentMeta}>
                        <strong>{comment.author.displayName}</strong>
                        <time dateTime={comment.createdAt}>
                          {commentCreatedAt}
                        </time>
                      </div>
                      <p>{comment.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
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
                className={styles.commentSubmit}
                disabled={!user || isSubmittingComment || !commentBody.trim()}
              >
                {isSubmittingComment ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </article>
  );
}
