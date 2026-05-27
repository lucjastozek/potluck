import { useState } from "react";
import styles from "@/components/feed/PostCard.module.css";
import { CommentNode } from "@/utils/buildCommentTree";
import type { Comment } from "@/api/feed";
import { formatRelativeTimestamp } from "@/utils/formatTimestamp";
import { getAvatarHueClass } from "@/utils/avatarHue";
import { addComment, deleteComment } from "@/api/feed";
import { useAuth } from "@/context/AuthContext";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

interface Props {
  node: CommentNode;
  postId: string;
  onAdd: (comment: Comment) => void;
  onDelete: (id: string) => void;
}

export default function CommentItem({ node, postId, onAdd, onDelete }: Props) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = async () => {
    if (!replyBody.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const { comment } = await addComment(postId, replyBody.trim(), node.id);
      onAdd(comment);
      setReplyBody("");
      setIsReplying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setIsDeleting(true);
    try {
      await deleteComment(postId, node.id);
      onDelete(node.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const created = formatRelativeTimestamp(node.createdAt);
  const avatarSeed = node.author.username ?? node.author.displayName;
  const avatarClass = getAvatarHueClass(avatarSeed);

  return (
    <li className={styles.commentItem}>
      {node.author.avatarUrl ? (
        <img
          src={node.author.avatarUrl}
          alt={node.author.displayName}
          className={styles.commentAvatar}
        />
      ) : (
        <img
          src="/assets/avatar.svg"
          alt=""
          aria-hidden="true"
          className={`${styles.commentAvatar} ${styles[avatarClass as keyof typeof styles] ?? ""}`}
        />
      )}

      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <strong>{node.author.displayName}</strong> {" · "}
          <time dateTime={node.createdAt}>{created}</time>
        </div>

        <p>{node.body}</p>

        <div className={styles.commentActions}>
          {user ? (
            <button
              type="button"
              className={`${styles.pillButton} ${styles.pillSmall}`}
              onClick={() => setIsReplying((v) => !v)}
            >
              <span className={styles.pillIcon}>
                <ReplyOutlined fontSize="inherit" />
              </span>
              Reply
            </button>
          ) : null}

          {user && user.id === node.author.id ? (
            <button
              type="button"
              className={`${styles.pillButton} ${styles.pillSmall} ${styles.pillDanger}`}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <span className={styles.pillIcon}>
                <DeleteOutline fontSize="inherit" />
              </span>
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          ) : null}
        </div>

        {isReplying ? (
          <div className={styles.replyContainer}>
            <textarea
              className={styles.commentInput}
              rows={3}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={user ? "Write a reply" : "Sign in to reply"}
              disabled={!user || isSubmitting}
            />
            <div className={styles.replyActions}>
              <button
                className={`${styles.pillButton} ${styles.pillPrimary}`}
                onClick={handleReply}
                disabled={!user || isSubmitting || !replyBody.trim()}
                type="button"
              >
                <span className={styles.pillIcon}>
                  <ReplyOutlined fontSize="inherit" />
                </span>
                {isSubmitting ? "Posting…" : "Reply"}
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setIsReplying(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {node.children && node.children.length > 0 ? (
          <ul className={styles.commentChildren}>
            {node.children.map((child) => (
              <CommentItem
                key={child.id}
                node={child}
                postId={postId}
                onAdd={onAdd}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
