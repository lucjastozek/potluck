import { useRef, useState } from "react";
import { uploadImage } from "@/api/uploads";
import styles from "./ImageUpload.module.css";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";

interface Props {
  /** Called with the public URL once the upload succeeds */
  onUploaded: (url: string) => void;
}

/**
 * A toolbar button that triggers an image upload for post content.
 * Drop this into your PostEditor toolbar.
 *
 * After a successful upload, call `editor.chain().setImage({ src: url }).run()`
 * (or however your editor inserts images) inside onUploaded.
 */
export default function ImageUpload({ onUploaded }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, "post", setProgress);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title="Insert image"
        aria-label="Insert image"
      >
        <AddPhotoIcon fontSize="inherit" />
        {uploading && <span className={styles.progress}>{progress}%</span>}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className={styles.hidden}
        onChange={handleChange}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
