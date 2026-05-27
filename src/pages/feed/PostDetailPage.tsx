import PostCard from "@/components/feed/PostCard";
import styles from "@/pages/feed/FeedPage.module.css";
import { getTodayFeed, type FeedPost } from "@/api/feed";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PostDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const targetCommentId = searchParams.get("comment");

  const [post, setPost] = useState<FeedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setMessage("Post not found.");
      setPost(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setMessage(null);

    getTodayFeed()
      .then(({ feed, message: feedMessage }) => {
        if (!isActive) return;

        const foundPost =
          feed?.posts.find((candidate) => candidate.id === id) ?? null;
        setPost(foundPost);

        if (!foundPost) {
          setMessage(feedMessage ?? "This post isn't in today's feed.");
        }
      })
      .catch(() => {
        if (!isActive) return;
        setPost(null);
        setMessage("We couldn't load today's feed right now.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <main className={styles.main}>
      <section className={styles.feed}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Post</h1>
          </div>

          <Link to="/feed" className={styles.createLink}>
            Back to feed
          </Link>
        </div>

        {isLoading ? (
          <p className={styles.emptyText}>Loading post…</p>
        ) : post ? (
          <PostCard
            post={post}
            isNotificationTarget
            targetCommentId={targetCommentId}
          />
        ) : (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>
              {message ?? "This post could not be found."}
            </h2>
            <Link to="/feed" className={styles.emptyLink}>
              Return to feed
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
