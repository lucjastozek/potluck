import { useRef, useState, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import { createPortal } from "react-dom";
import styles from "@/components/editor/popovers/ImagePopover.module.css";
import { useViewportPopoverPosition } from "@/hooks/useViewportPopoverPosition";

interface ImagePopoverProps {
  editor: Editor;
  onClose: () => void;
}

export default function ImagePopover({
  editor,
  onClose,
}: ImagePopoverProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ref: popoverRef, style } =
    useViewportPopoverPosition<HTMLDivElement>();
  const [altText, setAltText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, popoverRef]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleInsertImage = () => {
    if (!preview) return;

    editor
      .chain()
      .focus()
      .insertImage({
        src: preview,
        alt: altText || fileName,
        widthPercent: 50,
        wrap: "none",
      })
      .run();

    setAltText("");
    setPreview(null);
    setFileName("");
    onClose();
  };

  const content = (
    <div className={styles.popover} ref={popoverRef} style={style}>
      <div className={styles.section}>
        <button
          className={styles.uploadButton}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />
        {fileName && <p className={styles.fileName}>{fileName}</p>}
      </div>

      {preview && (
        <>
          <div className={styles.section}>
            <p className={styles.label}>Preview</p>
            <img src={preview} alt="Preview" className={styles.preview} />
          </div>
        </>
      )}

      <div className={styles.section}>
        <label htmlFor="image-alt-text" className={styles.label}>
          Alt Text
        </label>
        <input
          id="image-alt-text"
          type="text"
          className={styles.input}
          placeholder="Describe the image..."
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.insertButton}
          onClick={handleInsertImage}
          disabled={!preview}
        >
          Insert Image
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  return typeof document === "undefined"
    ? content
    : createPortal(content, document.body);
}
