import PostCard from "@/components/feed/PostCard";
import { SAMPLE_POSTS } from "@/data/samplePosts";

export default function FeedPage(): JSX.Element {
  return (
    <main>
      <h1>Potluck</h1>

      <section>
        {SAMPLE_POSTS.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>
    </main>
  );
}
