import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { PostAuthor } from "@/api/feed";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import FeedOutlined from "@mui/icons-material/FeedOutlined";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import MarkUnreadChatAltOutlined from "@mui/icons-material/MarkUnreadChatAltOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import styles from "./AppShell.module.css";
import { useAuth } from "@/context/AuthContext";
import { getAvatarHueClass } from "@/utils/avatarHue";
import PostEditor from "@/components/editor/PostEditor";
import { createPost, submitPost } from "@/api/posts";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/api/notifications";

function getNotificationActor(notification: Notification): PostAuthor | null {
  return notification.comment?.author ?? notification.actor ?? null;
}

function getNotificationTitle(notification: Notification): string {
  const actor = getNotificationActor(notification);

  switch (notification.type) {
    case "NEW_FEED":
      return "Your daily feed is ready";
    case "COMMENT_ON_POST":
      return `${actor?.displayName ?? "Someone"} commented on your post`;
    case "COMMENT_REPLY":
      return `${actor?.displayName ?? "Someone"} replied to your comment`;
    case "POST_LIKED":
      return `${actor?.displayName ?? "Someone"} liked your post`;
    case "NEW_FOLLOWER":
      return `${actor?.displayName ?? "Someone"} followed you`;
    case "DM_RECEIVED":
      return "New message";
    case "POST_SHARED":
      return `${actor?.displayName ?? "Someone"} shared a post with you`;
    case "POST_APPROVED":
      return "Your post was approved";
    case "POST_REJECTED":
      return "Your post was rejected";
    default:
      return "Notification";
  }
}

function getNotificationBody(notification: Notification): string {
  switch (notification.type) {
    case "COMMENT_ON_POST":
    case "COMMENT_REPLY":
      return notification.comment?.body ?? "";
    case "NEW_FEED":
      return "Open the feed to see today's edition.";
    case "DM_RECEIVED":
      return "Open your messages to reply.";
    case "POST_SHARED":
      return "Someone sent you a post in a message.";
    case "POST_APPROVED":
      return "It is scheduled to publish at midnight.";
    case "POST_REJECTED":
      return "Open drafts to update and resubmit it.";
    case "NEW_FOLLOWER":
      return "You have a new follower.";
    case "POST_LIKED":
      return "Someone liked one of your posts.";
    default:
      return "";
  }
}

function getNotificationHref(notification: Notification): string {
  const buildPostHref = (
    postId: string | null | undefined,
    commentId?: string | null,
  ) => {
    if (!postId) return "/feed";

    const params = new URLSearchParams();
    if (commentId) params.set("comment", commentId);
    const query = params.toString();
    return query ? `/post/${postId}?${query}` : `/post/${postId}`;
  };

  switch (notification.type) {
    case "NEW_FEED":
      return "/feed";
    case "COMMENT_ON_POST":
    case "COMMENT_REPLY": {
      const postId = notification.comment?.postId ?? notification.postId;
      const commentId = notification.comment?.id ?? null;
      return buildPostHref(postId, commentId);
    }
    case "POST_LIKED":
      return buildPostHref(notification.postId);
    case "NEW_FOLLOWER":
      return "/profile";
    case "DM_RECEIVED":
    case "POST_SHARED":
      return notification.conversationId
        ? `/messages/${notification.conversationId}`
        : "/messages";
    case "POST_APPROVED":
    case "POST_REJECTED":
      return "/posts/drafts";
    default:
      return "/feed";
  }
}

function getNotificationIcon(notification: Notification): JSX.Element {
  switch (notification.type) {
    case "NEW_FEED":
      return <FeedOutlined fontSize="inherit" />;
    case "COMMENT_ON_POST":
    case "COMMENT_REPLY":
      return <ChatBubbleOutlineOutlined fontSize="inherit" />;
    case "POST_LIKED":
      return <FavoriteBorderOutlined fontSize="inherit" />;
    case "NEW_FOLLOWER":
      return <PersonAddAlt1Outlined fontSize="inherit" />;
    case "DM_RECEIVED":
      return <MarkUnreadChatAltOutlined fontSize="inherit" />;
    case "POST_SHARED":
      return <ShareOutlined fontSize="inherit" />;
    case "POST_APPROVED":
      return <CheckCircleOutlineOutlined fontSize="inherit" />;
    case "POST_REJECTED":
      return <ErrorOutlineOutlined fontSize="inherit" />;
    default:
      return <NotificationsOutlined fontSize="inherit" />;
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  const ranges: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let elapsed = absSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [threshold, nextUnit] of ranges) {
    if (elapsed < threshold) {
      unit = nextUnit;
      break;
    }

    elapsed /= threshold;
    unit = nextUnit;
  }

  const pluralValue =
    unit === "second"
      ? diffInSeconds
      : unit === "minute"
        ? diffInSeconds / 60
        : unit === "hour"
          ? diffInSeconds / 3_600
          : unit === "day"
            ? diffInSeconds / 86_400
            : unit === "week"
              ? diffInSeconds / 604_800
              : unit === "month"
                ? diffInSeconds / 2_628_000
                : diffInSeconds / 31_536_000;

  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    Math.round(pluralValue),
    unit,
  );
}

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [composeError, setComposeError] = useState<string | null>(null);
  const [avatarClass, setAvatarClass] = useState("avatarHue0");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    readAll,
    read,
  } = useNotifications();

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
      setAvatarClass(getAvatarHueClass(user.username));
    }
  }, [user]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isNotificationsOpen && unreadCount > 0) {
      void readAll();
    }
  }, [isNotificationsOpen, readAll, unreadCount]);

  const handlePublishPost = async (markup: string) => {
    try {
      const { post } = await createPost(markup, []);
      await submitPost(post.id);
      navigate(`/posts/drafts`);
      setComposeError(null);
    } catch {
      setComposeError("We couldn't send this post to review right now.");
    }
  };

  const handleSaveDraft = async (markup: string) => {
    try {
      await createPost(markup, []);
      navigate(`/posts/drafts`);
      setComposeError(null);
    } catch {
      setComposeError("We couldn't save this draft right now.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((value) => !value);
    setIsUserMenuOpen(false);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await read(notification.id);
    } catch {
      /* empty */
    }

    handleCloseNotifications();
    navigate(getNotificationHref(notification));
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
              <>
                <div
                  className={styles.notificationMenu}
                  ref={notificationMenuRef}
                >
                  <button
                    type="button"
                    className={styles.notificationButton}
                    aria-haspopup="menu"
                    aria-expanded={isNotificationsOpen}
                    aria-label={
                      unreadCount > 0
                        ? `${unreadCount} unread notifications`
                        : "Notifications"
                    }
                    onClick={handleToggleNotifications}
                  >
                    <NotificationsOutlined fontSize="inherit" />
                    {unreadCount > 0 ? (
                      <span className={styles.notificationBadge}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {isNotificationsOpen ? (
                    <div className={styles.notificationPanel} role="menu">
                      <div className={styles.notificationPanelHeader}>
                        <h3 className={styles.notificationPanelTitle}>
                          Notifications
                        </h3>
                        <button
                          type="button"
                          className={styles.notificationPanelAction}
                          onClick={() => {
                            void readAll();
                          }}
                          disabled={notifications.length === 0}
                        >
                          Mark all read
                        </button>
                      </div>

                      {notificationsLoading ? (
                        <p className={styles.notificationEmpty}>
                          Loading notifications…
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className={styles.notificationEmpty}>
                          You’re all caught up.
                        </p>
                      ) : (
                        <div className={styles.notificationList}>
                          {notifications.map((notification) => {
                            const actor = getNotificationActor(notification);
                            return (
                              <button
                                key={notification.id}
                                type="button"
                                className={`${styles.notificationItem} ${notification.read ? "" : styles.notificationItemUnread}`}
                                onClick={() => {
                                  void handleNotificationClick(notification);
                                }}
                              >
                                <span className={styles.notificationIcon}>
                                  {getNotificationIcon(notification)}
                                </span>
                                <span className={styles.notificationCopy}>
                                  <span className={styles.notificationTitle}>
                                    {getNotificationTitle(notification)}
                                  </span>
                                  {getNotificationBody(notification) ? (
                                    <span className={styles.notificationBody}>
                                      {getNotificationBody(notification)}
                                    </span>
                                  ) : null}
                                  <span className={styles.notificationMeta}>
                                    {actor ? `${actor.displayName} • ` : ""}
                                    {formatRelativeTime(notification.createdAt)}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className={styles.userMenu} ref={userMenuRef}>
                  <button
                    type="button"
                    className={styles.userLink}
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                    onClick={() => {
                      setIsUserMenuOpen((value) => !value);
                      setIsNotificationsOpen(false);
                    }}
                  >
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
                          className={`${styles.avatar} ${styles[avatarClass as keyof typeof styles] ?? ""}`}
                        />
                      )}

                      <span className={styles.userCopy}>
                        <span className={styles.userName}>
                          {user.displayName}
                        </span>
                        <span className={styles.userHandle}>
                          @{user.username}
                        </span>
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen ? (
                    <div className={styles.userMenuPanel} role="menu">
                      {user.role === "MODERATOR" || user.role === "ADMIN" ? (
                        <Link
                          to="/moderation"
                          className={styles.userMenuItem}
                          role="menuitem"
                          onClick={handleCloseUserMenu}
                        >
                          <GavelOutlined fontSize="inherit" />
                          Moderation
                        </Link>
                      ) : null}
                      <Link
                        to="/profile"
                        className={styles.userMenuItem}
                        role="menuitem"
                        onClick={handleCloseUserMenu}
                      >
                        Profile settings
                      </Link>
                      <Link
                        to="/posts/drafts"
                        className={styles.userMenuItem}
                        role="menuitem"
                        onClick={handleCloseUserMenu}
                      >
                        My posts
                      </Link>
                      <button
                        type="button"
                        className={`${styles.userMenuItem} ${styles.userMenuLogout}`}
                        role="menuitem"
                        onClick={() => {
                          handleCloseUserMenu();
                          handleLogout();
                        }}
                      >
                        <LogoutRounded fontSize="inherit" />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
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
            <PostEditor
              onSubmit={handlePublishPost}
              onSecondaryAction={handleSaveDraft}
              submitLabel="Post"
              secondaryLabel="Save draft"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AppShell;
