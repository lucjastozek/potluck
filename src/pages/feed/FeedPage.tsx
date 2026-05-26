import PostCard from "@/components/feed/PostCard";
import { SAMPLE_POSTS } from "@/data/samplePosts";
import styles from "@/pages/feed/FeedPage.module.css";

export default function FeedPage(): JSX.Element {
  return (
    <main className={styles.main}>
      <section className={styles.feed}>
        <h1 className={styles.pageTitle}>Feed</h1>
        {SAMPLE_POSTS.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>
    </main>
  );
}
