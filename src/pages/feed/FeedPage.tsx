import PostCard from "@/components/feed/PostCard";
import styles from "@/pages/feed/FeedPage.module.css";
import { getFeed, Post } from "@/api/posts";
import { useState, useEffect } from "react";

export default function FeedPage(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    getFeed().then(({ posts }) => setPosts(posts));
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.feed}>
        <h1 className={styles.pageTitle}>Feed</h1>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>
    </main>
  );
}
