import PostEditor from "@/components/editor/PostEditor";

export default function CreatePostPage(): JSX.Element {
  const handleSubmit = (markup: string) => {
    console.log(markup);
  };

  return (
    <main style={{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem" }}>
      <PostEditor onSubmit={handleSubmit} />
    </main>
  );
}
