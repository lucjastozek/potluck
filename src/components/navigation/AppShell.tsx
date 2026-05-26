import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import styles from "./AppShell.module.css";
import { useAuth } from "@/context/AuthContext";
import { getAvatarHueRotation } from "@/utils/avatarHue";
import PostEditor from "@/components/editor/PostEditor";
import { createPost } from "@/api/posts";

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [composeError, setComposeError] = useState<string | null>(null);
  const [avatarHue, setAvatarHue] = useState("0");

  const searchParams = new URLSearchParams(location.search);
  const isComposerOpen = searchParams.get("compose") === "1";

  const closeComposer = useCallback(() => {
    const next = new URLSearchParams(location.search);
    next.delete("compose");
    setComposeError(null);
    navigate(
      {
        pathname: location.pathname,
        search: next.size > 0 ? `?${next.toString()}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!isComposerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeComposer();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeComposer, isComposerOpen]);

  useEffect(() => {
    if (user) {
      setAvatarHue(getAvatarHueRotation(user.username));
    }
  }, [user]);

  const handleCreatePost = async (markup: string) => {
    try {
      await createPost(markup);
      navigate(`/feed?refresh=${Date.now()}`);
      setComposeError(null);
    } catch {
      setComposeError("We couldn't publish this post right now.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>

      <header className={styles.navbar}>
        <div className={styles.inner}>
          <Link to="/feed" className={styles.brand} aria-label="Potluck home">
            <picture>
              <source
                srcSet="/assets/logo-dark.svg"
                media="(prefers-color-scheme: dark)"
              />
              <img
                src="/assets/logo-light.svg"
                alt=""
                aria-hidden="true"
                className={styles.brandLogo}
              />
            </picture>
            <span className={styles.brandCopy}>
              <span className={styles.brandName}>Potluck</span>
              <span className={styles.brandSub}>
                Bring something, leave with more!
              </span>
            </span>
          </Link>

          <div className={styles.actions}>
            {user ? (
              <Link to="/profile" className={styles.userLink}>
                <div className={styles.userChip}>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className={styles.avatar}
                    />
                  ) : (
                    <img
                      src="/assets/avatar.svg"
                      alt=""
                      aria-hidden="true"
                      className={styles.avatar}
                      style={{ filter: `hue-rotate(${avatarHue})` }}
                    />
                  )}

                  <span className={styles.userCopy}>
                    <span className={styles.userName}>{user.displayName}</span>
                    <span className={styles.userHandle}>@{user.username}</span>
                  </span>
                </div>
              </Link>
            ) : null}

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogoutRounded fontSize="inherit" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div id="main-content" className={styles.content}>
        <Outlet />
      </div>

      {isComposerOpen ? (
        <div className={styles.modalBackdrop}>
          <button
            type="button"
            className={styles.modalBackdropButton}
            aria-label="Close composer"
            onClick={closeComposer}
          />
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-label="Create a new post"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create post</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeComposer}
              >
                Close
              </button>
            </div>

            {composeError ? (
              <p className={styles.modalError}>{composeError}</p>
            ) : null}
            <PostEditor onSubmit={handleCreatePost} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AppShell;
