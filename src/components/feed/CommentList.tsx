import { useState, useEffect, useRef } from "react";
import styles from "@/components/feed/PostCard.module.css";
import type { Comment } from "@/api/feed";
import { addComment, deleteComment } from "@/api/feed";
import { CommentNode } from "@/utils/buildCommentTree";
import { formatRelativeTimestamp } from "@/utils/formatTimestamp";
import { getAvatarHueClass } from "@/utils/avatarHue";
import { useAuth } from "@/context/AuthContext";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

interface Props {
  nodes: CommentNode[];
  postId: string;
  targetCommentId?: string | null;
  onAdd: (c: Comment) => void;
  onDelete: (id: string) => void;
}

function nodeContainsCommentId(node: CommentNode, commentId: string): boolean {
  if (node.id === commentId) return true;
  return node.children.some((child) => nodeContainsCommentId(child, commentId));
}

export default function CommentList({
  nodes,
  postId,
  targetCommentId,
  onAdd,
  onDelete,
}: Props) {
  return (
    <ul className={styles.commentList}>
      {nodes.map((node) => (
        <CommentThread
          key={node.id}
          node={node}
          postId={postId}
          targetCommentId={targetCommentId}
          onAdd={onAdd}
          onDelete={onDelete}
          depth={0}
        />
      ))}
    </ul>
  );
}

function CommentThread({
  node,
  depth,
  postId,
  targetCommentId,
  onAdd,
  onDelete,
}: {
  node: CommentNode;
  depth: number;
  postId: string;
  targetCommentId?: string | null;
  onAdd: (c: Comment) => void;
  onDelete: (id: string) => void;
}) {
  const { user } = useAuth();
  const containsTargetComment =
    !!targetCommentId && nodeContainsCommentId(node, targetCommentId);
  const [isReplying, setIsReplying] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(
    depth === 0 || containsTargetComment,
  );
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const created = formatRelativeTimestamp(node.createdAt);
  const displayName = node.author.displayName;
  const usernameHandle = node.author.username ?? null;
  const avatarSeed = usernameHandle ?? node.author.displayName;
  const avatarClass = getAvatarHueClass(avatarSeed);
  const hasReplies = node.children.length > 0;

  const rowRef = useRef<HTMLLIElement | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const handleReply = async () => {
    if (!replyBody.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const { comment } = await addComment(postId, replyBody.trim(), node.id);
      onAdd(comment);
      setReplyBody("");
      setIsReplying(false);
      setIsRepliesOpen(true);
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

  useEffect(() => {
    if (containsTargetComment) {
      setIsRepliesOpen(true);
    }
  }, [containsTargetComment]);

  useEffect(() => {
    if (!rowRef.current) {
      setPaths([]);
      return;
    }

    const parentAvatar = rowRef.current.querySelector(
      `.${styles.commentAvatar}`,
    ) as HTMLElement | null;
    if (!parentAvatar) {
      setPaths([]);
      setSvgSize({ width: 0, height: 0 });
      return;
    }

    const childrenList = rowRef.current.querySelector(
      `.${styles.commentChildren}`,
    ) as HTMLElement | null;

    let timeout: number | undefined;
    const debounce = (fn: () => void, wait = 80) => {
      return () => {
        if (timeout) clearTimeout(timeout);
        timeout = window.setTimeout(() => fn(), wait);
      };
    };

    const computePaths = () => {
      if (!rowRef.current || !parentAvatar) {
        setPaths([]);
        return;
      }

      const containerRect = rowRef.current.getBoundingClientRect();
      const parentRect = parentAvatar.getBoundingClientRect();

      if (!childrenList) {
        setPaths([]);
        setSvgSize({
          width: Math.round(rowRef.current.scrollWidth),
          height: Math.round(rowRef.current.scrollHeight),
        });
        return;
      }

      const newPaths: string[] = [];

      const childRows = Array.from(childrenList.children) as HTMLElement[];
      for (const childRow of childRows) {
        const childAvatar = childRow.querySelector(
          `.${styles.commentAvatar}`,
        ) as HTMLElement | null;
        if (!childAvatar) continue;

        const childRect = childAvatar.getBoundingClientRect();
        const childRowStyle = window.getComputedStyle(childRow);
        if (
          childRowStyle.display === "none" ||
          childRowStyle.visibility === "hidden"
        )
          continue;
        if (!childRow.offsetParent) continue;
        if (childRect.height < 2 || childRect.width < 2) continue;

        const x1 = parentRect.left - containerRect.left + parentRect.width / 2;
        const y1 = parentRect.top - containerRect.top + parentRect.height / 2;

        const parentMid = parentRect.top + parentRect.height / 2;
        if (childRect.top <= parentMid + 2) continue;
        if (Math.abs(childRect.top - parentRect.bottom) < 6) continue;

        const x2 = childRect.left - containerRect.left + childRect.width / 2;
        const y2 = childRect.top - containerRect.top + childRect.height / 2;

        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        let radius = Math.max(2, Math.min(12, Math.min(width, height) * 0.2));
        radius = Math.min(radius, Math.min(width / 2 - 1, height / 2 - 1));
        if (radius < 0) radius = 0;

        const yCornerStart = y2 - radius;
        const xCornerEnd = x1 + radius;
        const d = `M ${x1} ${y1} L ${x1} ${yCornerStart} A ${radius} ${radius} 0 0 0 ${xCornerEnd} ${y2} L ${x2} ${y2}`;
        newPaths.push(d);
      }

      setPaths(newPaths);
      setSvgSize({
        width: Math.round(rowRef.current.scrollWidth),
        height: Math.round(rowRef.current.scrollHeight),
      });
    };

    const debouncedCompute = debounce(computePaths, 60);

    if (isRepliesOpen) computePaths();
    else setPaths([]);

    const ro = new ResizeObserver(debouncedCompute);
    ro.observe(rowRef.current);
    if (childrenList) ro.observe(childrenList);

    const mo = new MutationObserver(debouncedCompute);
    if (childrenList)
      mo.observe(childrenList, {
        childList: true,
        subtree: true,
        attributes: true,
      });

    window.addEventListener("resize", debouncedCompute);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", debouncedCompute);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [isRepliesOpen, node.children]);

  return (
    <li
      ref={rowRef}
      data-comment-id={node.id}
      className={`${styles.commentRow} ${hasReplies && isRepliesOpen ? styles.hasRepliesOpen : ""}`}
      data-depth={depth}
    >
      <div className={styles.commentCard}>
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

        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <div className={styles.commentMeta}>
              <strong>{displayName}</strong>
              <span className={styles.commentDot}>·</span>
              <time dateTime={node.createdAt}>{created}</time>
            </div>
          </div>

          <div className={styles.commentText}>
            <p>{node.body}</p>
          </div>

          {isReplying ? (
            <div className={styles.replyBox}>
              <textarea
                className={`${styles.commentInput} ${styles.replyTextarea}`}
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
                  {isSubmitting ? "Posting…" : "Post reply"}
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

          {!isReplying ? (
            <div className={styles.commentFooter}>
              <div className={styles.commentActionsRow}>
                {hasReplies ? (
                  <button
                    type="button"
                    className={styles.commentThreadToggle}
                    onClick={() => setIsRepliesOpen((value) => !value)}
                    aria-expanded={isRepliesOpen}
                  >
                    {isRepliesOpen
                      ? `Hide replies (${node.children.length})`
                      : `Show replies (${node.children.length})`}
                  </button>
                ) : null}
                {user ? (
                  <button
                    type="button"
                    className={styles.commentActionButton}
                    onClick={() => setIsReplying((value) => !value)}
                    aria-expanded={isReplying}
                  >
                    <span className={styles.commentActionIcon}>
                      <ReplyOutlined fontSize="inherit" />
                    </span>
                    Reply
                  </button>
                ) : null}

                {user && user.id === node.author.id ? (
                  <button
                    type="button"
                    className={`${styles.commentActionButton} ${styles.commentActionDanger}`}
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <span className={styles.commentActionIcon}>
                      <DeleteOutline fontSize="inherit" />
                    </span>
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {hasReplies && isRepliesOpen ? (
        <>
          <svg
            className={styles.connectorSvg}
            aria-hidden="true"
            width={svgSize.width || undefined}
            height={svgSize.height || undefined}
            viewBox={
              svgSize.width && svgSize.height
                ? `0 0 ${svgSize.width} ${svgSize.height}`
                : undefined
            }
            preserveAspectRatio="none"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          </svg>

          <ul className={styles.commentChildren}>
            {node.children.map((child) => (
              <CommentThread
                key={child.id}
                node={child}
                depth={depth + 1}
                postId={postId}
                targetCommentId={targetCommentId}
                onAdd={onAdd}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </>
      ) : null}
    </li>
  );
}
