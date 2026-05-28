import { useEditor, EditorContent } from "@tiptap/react";
import Toolbar from "@/components/editor/Toolbar";
import { serializeToMarkup } from "@/utils/serializer";
import { deserializeFromMarkup } from "@/utils/deserializer";
import styles from "@/components/editor/PostEditor.module.css";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/bodyScrollLock";
import { useViewportDimensions } from "@/hooks/useViewportDimensions";
import { EDITOR_EXTENSIONS } from "@/components/editor/editorExtensions";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DraftsOutlined from "@mui/icons-material/DraftsOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

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
  const { width, height, keyboardOpen, visualHeight } = useViewportDimensions();
  const isMobile = width <= 720;
  const [mobileViewportSnapshot, setMobileViewportSnapshot] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [mobileSidebarAutoCollapsed, setMobileSidebarAutoCollapsed] =
    useState(false);
  const [mobileWriteMode, setMobileWriteMode] = useState(false);
  const [mobileHeadingMenuOpen, setMobileHeadingMenuOpen] = useState(false);
  const [toolbarPinned, setToolbarPinned] = useState(false);
  const mobileHeadingDockRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setMobileHeadingMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || keyboardOpen || !mobileSidebarAutoCollapsed) return;

    setMobileSidebarOpen(true);
    setMobileSidebarAutoCollapsed(false);
  }, [isMobile, keyboardOpen, mobileSidebarAutoCollapsed]);

  useEffect(() => {
    if (!isMobile) {
      setMobileWriteMode(false);
      return;
    }

    if (!keyboardOpen) {
      setMobileWriteMode(false);
    }
  }, [isMobile, keyboardOpen]);

  useEffect(() => {
    if (!isMobile) {
      setMobileViewportSnapshot(null);
      return;
    }

    setMobileViewportSnapshot((current) => {
      if (current) {
        return current;
      }

      return { width, height };
    });
  }, [height, isMobile, width]);

  useEffect(() => {
    if (!isMobile || !editor) return;

    const inputMode = mobileWriteMode ? "text" : "none";
    editor.view.dom.setAttribute("inputmode", inputMode);

    if (!mobileWriteMode) {
      editor.commands.blur();
    }
  }, [editor, isMobile, mobileWriteMode]);

  useEffect(() => {
    if (!isMobile || !editor) return;

    const collapseForWriting = () => {
      if (toolbarPinned) return;
      setMobileSidebarOpen(false);
      setMobileSidebarAutoCollapsed(true);
    };

    const onBeforeInput = (event: InputEvent) => {
      const inputType = event.inputType ?? "";
      if (inputType.startsWith("insert") || inputType.startsWith("delete")) {
        collapseForWriting();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const isCharacterKey = event.key.length === 1;
      const isEditingKey =
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "Enter";

      if (isCharacterKey || isEditingKey) {
        collapseForWriting();
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener("beforeinput", onBeforeInput);
    editorDom.addEventListener("keydown", onKeyDown);

    return () => {
      editorDom.removeEventListener("beforeinput", onBeforeInput);
      editorDom.removeEventListener("keydown", onKeyDown);
    };
  }, [editor, isMobile, toolbarPinned]);

  useEffect(() => {
    if (!isMobile || !mobileHeadingMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        mobileHeadingDockRef.current &&
        !mobileHeadingDockRef.current.contains(event.target as Node)
      ) {
        setMobileHeadingMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileHeadingMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, mobileHeadingMenuOpen]);

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

  const headingState = editor
    ? (() => {
        const currentHeadingLevel =
          HEADING_LEVELS.find((level) =>
            editor.isActive("heading", { level }),
          ) ?? 0;
        let previousHeadingLevel = 0;
        const selectionFrom = editor.state.selection.from;

        editor.state.doc.descendants((node, pos) => {
          const nodeEnd = pos + node.nodeSize;
          const selectionInsideNode =
            pos <= selectionFrom && selectionFrom < nodeEnd;

          if (
            node.type.name === "heading" &&
            pos < selectionFrom &&
            !selectionInsideNode
          ) {
            previousHeadingLevel = Number(node.attrs.level) || 0;
          }
        });

        const maxHeadingLevel =
          previousHeadingLevel === 0
            ? 1
            : Math.min(previousHeadingLevel + 1, 6);
        const headingOptions = HEADING_LEVELS.filter(
          (level) => level <= maxHeadingLevel,
        );

        return {
          currentHeadingLevel,
          headingOptions,
          headingValue: currentHeadingLevel
            ? String(currentHeadingLevel)
            : "paragraph",
        };
      })()
    : null;

  const headingOptions = headingState
    ? [
        { value: "paragraph", label: "Paragraph", disabled: false },
        ...(headingState.currentHeadingLevel &&
        !headingState.headingOptions.includes(headingState.currentHeadingLevel)
          ? [
              {
                value: String(headingState.currentHeadingLevel),
                label: `Heading ${headingState.currentHeadingLevel}`,
                disabled: true,
              },
            ]
          : []),
        ...headingState.headingOptions.map((level) => ({
          value: String(level),
          label: `Heading ${level}`,
          disabled: false,
        })),
      ]
    : [];

  const headingLabel = headingState
    ? headingState.headingValue === "paragraph"
      ? "Paragraph"
      : `Heading ${headingState.headingValue}`
    : "Paragraph";

  const handleEditorBodyPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!isMobile || !editor || mobileWriteMode) return;

    const eventTarget = event.target as HTMLElement | null;
    const tappedEditorContent = eventTarget?.closest(".ProseMirror");

    if (!tappedEditorContent) return;

    const { from, to } = editor.state.selection;
    const isCaretSelection = from === to;

    if (!isCaretSelection) return;

    editor.view.dom.setAttribute("inputmode", "text");
    setMobileWriteMode(true);
    editor.chain().focus().run();
  };

  const surface = (
    <section
      className={`${styles.shell} ${isMobile ? styles.mobileShell : ""} ${
        isMobile && mobileSidebarOpen ? styles.mobileShellOpen : ""
      } ${isMobile && !mobileSidebarOpen ? styles.mobileShellCollapsed : ""} ${
        keyboardOpen ? styles.keyboardOpen : ""
      } ${isMobile && headingState ? styles.mobileHeadingVisible : ""}`}
      style={
        isMobile
          ? {
              height: `${
                keyboardOpen
                  ? Math.min(
                      mobileViewportSnapshot?.height ?? height,
                      visualHeight,
                    )
                  : (mobileViewportSnapshot?.height ?? height)
              }px`,
              maxHeight: `${
                keyboardOpen
                  ? Math.min(
                      mobileViewportSnapshot?.height ?? height,
                      visualHeight,
                    )
                  : (mobileViewportSnapshot?.height ?? height)
              }px`,
            }
          : undefined
      }
      aria-label={title ?? "Post editor"}
    >
      {!isMobile && (title || subtitle || status || onClose) && (
        <header className={styles.header}>
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
            {title ? <h1 className={styles.title}>{title}</h1> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            {error ? <div className={styles.error}>{error}</div> : null}
            {banner ? <div className={styles.banner}>{banner}</div> : null}
          </div>
        </header>
      )}

      {isMobile && headingState ? (
        <div className={styles.mobileHeadingDock} ref={mobileHeadingDockRef}>
          <button
            type="button"
            className={styles.mobileHeadingButton}
            aria-label="Heading level"
            aria-haspopup="listbox"
            aria-expanded={mobileHeadingMenuOpen}
            title="Heading level"
            onClick={() => setMobileHeadingMenuOpen((current) => !current)}
          >
            <span className={styles.mobileHeadingButtonLabel}>
              {headingLabel}
            </span>
            <span
              className={styles.mobileHeadingButtonChevron}
              aria-hidden="true"
            />
          </button>

          {mobileHeadingMenuOpen ? (
            <div
              className={styles.mobileHeadingMenu}
              role="listbox"
              aria-label="Heading level options"
            >
              {headingOptions.map(({ value, label, disabled }) => {
                const isActive = value === headingState.headingValue;

                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.mobileHeadingOption} ${isActive ? styles.mobileHeadingOptionActive : ""}`}
                    role="option"
                    aria-selected={isActive}
                    disabled={disabled}
                    onClick={() => {
                      if (disabled) return;

                      if (value === "paragraph") {
                        editor?.chain().focus().setParagraph().run();
                      } else {
                        const level = Number(value) as 1 | 2 | 3 | 4 | 5 | 6;
                        editor?.chain().focus().toggleHeading({ level }).run();
                      }

                      setMobileHeadingMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {isMobile && onClose ? (
        <button
          type="button"
          className={styles.closeButtonMobile}
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
        >
          <CloseRounded fontSize="inherit" />
        </button>
      ) : null}

      {isMobile ? (
        <button
          type="button"
          className={styles.mobileToolbarToggle}
          style={{
            left: mobileSidebarOpen
              ? "calc(var(--mobile-toolbar-width) + 0.15rem)"
              : "0.35rem",
          }}
          onClick={() => {
            setMobileSidebarAutoCollapsed(false);
            setMobileSidebarOpen((current) => !current);
          }}
          aria-label={mobileSidebarOpen ? "Hide tools" : "Show tools"}
          title={mobileSidebarOpen ? "Hide tools" : "Show tools"}
        >
          {mobileSidebarOpen ? (
            <ChevronLeftRounded fontSize="inherit" />
          ) : (
            <ChevronRightRounded fontSize="inherit" />
          )}
        </button>
      ) : null}

      <div className={styles.editorShell}>
        <div
          className={`${styles.toolbarSlot} ${
            isMobile
              ? mobileSidebarOpen
                ? styles.toolbarSlotOpen
                : styles.toolbarSlotCollapsed
              : ""
          }`}
        >
          <Toolbar
            editor={editor}
            compact={keyboardOpen}
            onPinChange={setToolbarPinned}
          />
        </div>
        <div
          className={`${styles.editorBody} ${
            isMobile
              ? mobileSidebarOpen
                ? styles.editorBodyMobileOpen
                : styles.editorBodyMobileCollapsed
              : ""
          }`}
          onPointerUp={isMobile ? handleEditorBodyPointerUp : undefined}
        >
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>

        {!isMobile ? (
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
        ) : null}
      </div>

      {isMobile ? (
        <div className={styles.mobileActions}>
          {secondaryLabel && onSecondaryAction ? (
            <button
              type="button"
              className={`${styles.mobileActionButton} ${styles.mobileActionSecondary}`}
              onClick={handleSecondaryAction}
              disabled={disabled}
              aria-label={secondaryLabel}
              title={secondaryLabel}
            >
              <DraftsOutlined fontSize="inherit" />
            </button>
          ) : null}
          <button
            type="button"
            className={`${styles.mobileActionButton} ${styles.mobileActionPrimary}`}
            onClick={handleSubmit}
            disabled={disabled}
            aria-label={submitLabel}
            title={submitLabel}
          >
            <SendRounded fontSize="inherit" />
          </button>
        </div>
      ) : null}
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
