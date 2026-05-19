import { useRef, useState, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import styles from "@/components/editor/popovers/ImagePopover.module.css";

interface ImagePopoverProps {
  editor: Editor;
  onClose: () => void;
}

export default function ImagePopover({
  editor,
  onClose,
}: ImagePopoverProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
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
  }, [onClose]);

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

    // Reset and close
    setAltText("");
    setPreview(null);
    setFileName("");
    onClose();
  };

  return (
    <div className={styles.popover} ref={popoverRef}>
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
}
