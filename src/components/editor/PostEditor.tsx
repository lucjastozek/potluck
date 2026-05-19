import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/components/editor/Toolbar";
import { serializeToMarkup } from "@/utils/serializer";
import styles from "@/components/editor/PostEditor.module.css";
import { ColorMark } from "@/components/editor/extensions/ColorMark";
import { useState } from "react";
import { RainbowNode } from "@/components/editor/extensions/RainbowNode";
import { GlitterNode } from "@/components/editor/extensions/GlitterNode";
import { HighlightMark } from "@/components/editor/extensions/HighlightMark";
import { OutlineMark } from "@/components/editor/extensions/OutlineMark";
import { NeonMark } from "@/components/editor/extensions/NeonMark";
import { ShadowMark } from "@/components/editor/extensions/ShadowMark";
import { ShakeNode } from "@/components/editor/extensions/ShakeNode";
import { SpoilerNode } from "@/components/editor/extensions/SpoilerNode";

const EXTENSIONS = [
  StarterKit,
  ColorMark,
  RainbowNode,
  GlitterNode,
  HighlightMark,
  OutlineMark,
  NeonMark,
  ShadowMark,
  ShakeNode,
  SpoilerNode,
];

interface PostEditorProps {
  onSubmit: (markup: string) => void;
  placeholder?: string;
}

export default function PostEditor({
  onSubmit,
  placeholder = "What's on your mind?",
}: PostEditorProps): JSX.Element {
  const editor = useEditor({
    extensions: EXTENSIONS,
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
          Send
        </button>
      </div>
    </div>
  );
}
