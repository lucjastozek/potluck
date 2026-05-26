import { useRef, useState } from "react";
import { uploadImage } from "@/api/uploads";
import { useAuth } from "@/context/AuthContext";
import { getAvatarInitials } from "@/utils/avatarInitials";
import styles from "./AvatarUpload.module.css";

interface Props {
  /** Current avatar URL — falls back to initials if null */
  avatarUrl: string | null;
  displayName: string;
  size?: number;
  /** Called after a successful upload with the new public URL */
  onUploaded?: (url: string) => void;
}

export default function AvatarUpload({
  avatarUrl,
  displayName,
  size = 80,
  onUploaded,
}: Props): JSX.Element {
  const { refreshUser } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const initials = getAvatarInitials(displayName);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, "avatar", setProgress);
      await refreshUser(); // updates user.avatarUrl in context
      onUploaded?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset so re-selecting the same file still fires onChange
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const src = preview ?? avatarUrl;

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Change avatar"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {src ? (
          <img src={src} alt={displayName} className={styles.img} />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}

        <span className={styles.overlay}>
          {uploading ? `${progress}%` : "Change"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
