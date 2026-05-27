import PostCard from "@/components/feed/PostCard";
import styles from "@/pages/feed/FeedPage.module.css";
import { getTodayFeed, getArchiveFeed, FeedPost } from "@/api/feed";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FeedPage(): JSX.Element {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const targetPostId = searchParams.get("post");
  const targetCommentId = searchParams.get("comment");

  useEffect(() => {
    const path = location.pathname;
    const archiveMatch = path.match(/^\/feed\/(\d{4}-\d{2}-\d{2})$/);
    (async () => {
      setMessage(null);
      if (archiveMatch) {
        const date = archiveMatch[1];
        try {
          const { feed } = await getArchiveFeed(date);
          setPosts(feed.posts);
        } catch {
          setMessage("No feed found for that date.");
          setPosts([]);
        }
      } else {
        const res = await getTodayFeed();
        if (!res.feed) {
          setMessage(
            res.message ||
              "Your feed isn't ready yet. Check back after midnight.",
          );
          setPosts([]);
        } else {
          setPosts(res.feed.posts);
        }
      }
    })();
  }, [location.pathname]);

  return (
    <main className={styles.main}>
      <section className={styles.feed}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Feed</h1>
            <p className={styles.pageSubtitle}>Your daily dose of posts</p>
          </div>

          <Link to="/feed?compose=1" className={styles.createLink}>
            New post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>
              {message || "Your feed is quiet right now."}
            </h2>
            {!message && (
              <>
                <p className={styles.emptyText}>
                  Start the conversation by sharing something new.
                </p>
                <Link to="/feed?compose=1" className={styles.emptyLink}>
                  Write the first post
                </Link>
              </>
            )}
          </div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              isNotificationTarget={targetPostId === p.id}
              targetCommentId={targetPostId === p.id ? targetCommentId : null}
            />
          ))
        )}
      </section>
    </main>
  );
}
