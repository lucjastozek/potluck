import styles from "@/components/feed/PostCard.module.css";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import LikedIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Message";
import { Post, toggleLike } from "@/api/posts";
import { getAvatarInitials } from "@/utils/avatarInitials";
import { formatTimestamp } from "@/utils/formatTimestamp";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props): JSX.Element {
  const [liked, setLiked] = useState(false);
  const avatarInitials = getAvatarInitials(post.author.displayName);
  const createdAt = formatTimestamp(post.createdAt);

  const content = deserializeFromMarkup(post.markup);
  const editor = useEditor({
    editable: false,
    extensions: EDITOR_EXTENSIONS,
    content,
    editorProps: {
      attributes: { class: editorStyles.editorContent },
    },
  });

  const handleLike = async () => {
    const { liked } = await toggleLike(post.id);
    setLiked(liked);
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
          <span className={styles.avatar} aria-hidden="true">
            {avatarInitials}
          </span>
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

        <button className={styles.actionBtn}>
          <CommentIcon fontSize="inherit" />
          <span>Comment</span>
        </button>
      </div>
    </article>
  );
}
