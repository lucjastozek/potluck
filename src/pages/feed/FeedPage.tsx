import PostCard from "@/components/feed/PostCard";
import styles from "@/pages/feed/FeedPage.module.css";
import { getFeed, Post } from "@/api/posts";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FeedPage(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const location = useLocation();
  useEffect(() => {
    getFeed().then(({ posts }) => setPosts(posts));
  }, [location.search]);

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
            <h2 className={styles.emptyTitle}>Your feed is quiet right now.</h2>
            <p className={styles.emptyText}>
              Start the conversation by sharing something new.
            </p>
            <Link to="/feed?compose=1" className={styles.emptyLink}>
              Write the first post
            </Link>
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </section>
    </main>
  );
}
