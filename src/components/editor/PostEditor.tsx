import { useEditor, EditorContent } from "@tiptap/react";
import Toolbar from "@/components/editor/Toolbar";
import { serializeToMarkup } from "@/utils/serializer";
import styles from "@/components/editor/PostEditor.module.css";
import { useState } from "react";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";

interface PostEditorProps {
  onSubmit: (markup: string) => void;
  placeholder?: string;
}

export default function PostEditor({
  onSubmit,
  placeholder = "What's on your mind?",
}: PostEditorProps): JSX.Element {
  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: "",
    editorProps: {
      attributes: {
        class: styles.editorContent,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Post editor",
        spellcheck: "true",
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      setDisabled(editor.isEmpty);
    },
  });

  const handleSubmit = () => {
    if (!editor) return;
    const markup = serializeToMarkup(editor.getJSON());
    onSubmit(markup);
    editor.commands.clearContent();
  };

  const [disabled, setDisabled] = useState(true);

  return (
    <div className={styles.shell}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className={styles.editorBody} />

      <div className={styles.footer}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={disabled}
        >
          Post
        </button>
      </div>
    </div>
  );
}
