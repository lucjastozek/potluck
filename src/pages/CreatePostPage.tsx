import PostEditor from "@/components/editor/PostEditor";

export default function CreatePostPage(): JSX.Element {
  const handleSubmit = (markup: string) => {
    console.log(markup);
  };

  return (
    <main>
      <PostEditor onSubmit={handleSubmit} />
    </main>
  );
}
