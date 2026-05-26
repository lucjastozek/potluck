import type { Post } from "@/data/samplePosts";
import styles from "@/components/feed/PostCard.module.css";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { deserializeFromMarkup } from "@/utils/deserializer";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import editorStyles from "@/components/editor/PostEditor.module.css";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props): JSX.Element {
  const [liked, setLiked] = useState(false);

  const content = deserializeFromMarkup(post.markup);
  const editor = useEditor({
    editable: false,
    extensions: EDITOR_EXTENSIONS,
    content,
    editorProps: {
      attributes: { class: editorStyles.editorContent },
    },
  });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <img
          src={`/assets/avatar-${post.id}.png`}
          alt=""
          className={styles.avatar}
          aria-hidden
        />

        <div className={styles.meta}>
          <h4 className={styles.author}>{post.authorHeader}</h4>
          <div className={styles.date}>
            {post.author} • {post.date}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {editor ? <EditorContent editor={editor} /> : null}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button className={styles.actionBtn}>
          <span>💬</span>
          <span>Comment</span>
        </button>
      </div>
    </article>
  );
}
