import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import AvatarUpload from "@/components/upload/AvatarUpload";
import styles from "./ProfileSettingsPage.module.css";

export default function ProfileSettingsPage(): JSX.Element {
  const { user, updateDisplayName } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <></>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setError(null);
    setSaving(true);

    try {
      await updateDisplayName(displayName.trim());
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Profile settings</h1>

        {/* Avatar */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Avatar</h2>
          <AvatarUpload
            avatarUrl={user.avatarUrl}
            displayName={user.displayName}
            username={user.username}
            size={88}
          />
        </section>

        {/* Username — read-only */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Username</h2>
          <div className={styles.readOnly}>
            <span className={styles.atSign}>@</span>
            <span>{user.username}</span>
          </div>
          <p className={styles.hint}>
            Usernames can't be changed after account creation.
          </p>
        </section>

        {/* Display name — editable */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Display name</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name ✨"
              maxLength={64}
              disabled={saving}
            />
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving || !displayName.trim()}
            >
              {saving ? "Saving…" : savedMsg ? "Saved ✓" : "Save"}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </section>

        {/* Email — read-only */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Email</h2>
          <div className={styles.readOnly}>{user.email}</div>
        </section>
      </div>
    </main>
  );
}
