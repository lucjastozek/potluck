import PostEditor from "@/components/editor/PostEditor";
import { createPost, submitPost } from "@/api/posts";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage(): JSX.Element {
  const navigate = useNavigate();
  const handlePublish = async (markup: string) => {
    const { post } = await createPost(markup, []);
    await submitPost(post.id);
    navigate("/posts/drafts");
  };

  const handleSaveDraft = async (markup: string) => {
    await createPost(markup, []);
    navigate("/posts/drafts");
  };

  return (
    <main>
      <PostEditor
        onSubmit={handlePublish}
        onSecondaryAction={handleSaveDraft}
        submitLabel="Post"
        secondaryLabel="Save draft"
        title="Create post"
        subtitle="Write something new. You can publish it now or save it as a draft."
        onClose={() => navigate("/posts/drafts")}
      />
    </main>
  );
}
