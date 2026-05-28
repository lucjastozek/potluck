import { useEditor, EditorContent } from "@tiptap/react";
import Toolbar from "@/components/editor/Toolbar";
import { serializeToMarkup } from "@/utils/serializer";
import { deserializeFromMarkup } from "@/utils/deserializer";
import styles from "@/components/editor/PostEditor.module.css";
import { useEffect, useState, type ReactNode } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/bodyScrollLock";
import { useViewportDimensions } from "@/hooks/useViewportDimensions";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import CloseRounded from "@mui/icons-material/CloseRounded";

interface PostEditorProps {
  onSubmit: (markup: string) => void;
  onSecondaryAction?: (markup: string) => void;
  placeholder?: string;
  initialMarkup?: string;
  submitLabel?: string;
  secondaryLabel?: string;
  title?: string;
  subtitle?: ReactNode;
  status?: ReactNode;
  banner?: ReactNode;
  error?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

export default function PostEditor({
  onSubmit,
  onSecondaryAction,
  placeholder = "What's on your mind?",
  initialMarkup = "",
  submitLabel = "Post",
  secondaryLabel,
  title,
  subtitle,
  status,
  banner,
  error,
  onClose,
  closeLabel = "Close",
}: PostEditorProps): JSX.Element {
  const { width, visualHeight, keyboardOpen } = useViewportDimensions();
  const isMobile = width <= 720;
  const hideHeaderCopy = isMobile && (keyboardOpen || visualHeight <= 560);
  const shellStyle = isMobile
    ? {
        height: `${Math.max(visualHeight, 320)}px`,
        maxHeight: `${Math.max(visualHeight, 320)}px`,
      }
    : undefined;

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: deserializeFromMarkup(initialMarkup),
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

  useEffect(() => {
    if (!editor) return;
    setDisabled(editor.isEmpty);
  }, [editor]);

  const handleSubmit = () => {
    if (!editor) return;
    const markup = serializeToMarkup(editor.getJSON());
    onSubmit(markup);
    editor.commands.clearContent();
  };

  const handleSecondaryAction = () => {
    if (!editor || !onSecondaryAction) return;
    const markup = serializeToMarkup(editor.getJSON());
    onSecondaryAction(markup);
    editor.commands.clearContent();
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!onClose) return;

    lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockBodyScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const surface = (
    <section
      className={`${styles.shell} ${hideHeaderCopy ? styles.keyboardOpen : ""}`}
      style={shellStyle}
      aria-label={title ?? "Post editor"}
    >
      {(title || subtitle || status || onClose) && (
        <header
          className={`${styles.header} ${hideHeaderCopy ? styles.headerCompact : ""}`}
        >
          <div className={styles.headerCopy}>
            <div className={styles.headerTop}>
              {status ? <div className={styles.statusRow}>{status}</div> : null}
              {onClose ? (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label={closeLabel}
                  title={closeLabel}
                >
                  <CloseRounded fontSize="inherit" />
                </button>
              ) : null}
            </div>
            {!hideHeaderCopy && title ? (
              <h1 className={styles.title}>{title}</h1>
            ) : null}
            {!hideHeaderCopy && subtitle ? (
              <p className={styles.subtitle}>{subtitle}</p>
            ) : null}
            {!hideHeaderCopy && error ? (
              <div className={styles.error}>{error}</div>
            ) : null}
            {!hideHeaderCopy && banner ? (
              <div className={styles.banner}>{banner}</div>
            ) : null}
          </div>
        </header>
      )}

      <div className={styles.editorShell}>
        <Toolbar editor={editor} compact={hideHeaderCopy} />
        <div className={styles.editorBody}>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>

        <div className={styles.footer}>
          <div className={styles.footerMeta} />
          <div className={styles.footerActions}>
            {secondaryLabel && onSecondaryAction ? (
              <button
                className={styles.secondaryButton}
                onClick={handleSecondaryAction}
                disabled={disabled}
              >
                {secondaryLabel}
              </button>
            ) : null}
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={disabled}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  if (onClose) {
    return (
      <div className={styles.modalRoot}>
        <button
          type="button"
          className={styles.backdrop}
          aria-label={closeLabel}
          onClick={onClose}
        />
        {surface}
      </div>
    );
  }

  return surface;
}
