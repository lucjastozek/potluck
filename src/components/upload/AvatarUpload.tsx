import { useRef, useState } from "react";
import { uploadImage } from "@/api/uploads";
import { useAuth } from "@/context/AuthContext";
import { getAvatarHueClass } from "@/utils/avatarHue";
import styles from "./AvatarUpload.module.css";

interface Props {
  avatarUrl: string | null;
  displayName: string;
  username?: string;
  size?: number;
  onUploaded?: (url: string) => void;
}

export default function AvatarUpload({
  avatarUrl,
  displayName,
  username,
  size = 80,
  onUploaded,
}: Props): JSX.Element {
  const { refreshUser } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const avatarSeed = username ?? displayName;
  const avatarClass = getAvatarHueClass(avatarSeed);

  const sizeClass =
    size === 88 ? styles.size88 : size === 40 ? styles.size40 : styles.size80;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, "avatar", setProgress);
      await refreshUser();
      onUploaded?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const src = preview ?? avatarUrl;

  return (
    <div className={`${styles.wrapper} ${sizeClass}`}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Change avatar"
      >
        {src ? (
          <img src={src} alt={displayName} className={styles.img} />
        ) : (
          <img
            src="/assets/avatar.svg"
            alt={displayName}
            className={`${styles.img} ${styles[avatarClass as keyof typeof styles] ?? ""}`}
          />
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
