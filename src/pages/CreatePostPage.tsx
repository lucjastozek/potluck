import PostEditor from "@/components/editor/PostEditor";
import { createPost } from "@/api/posts";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage(): JSX.Element {
  const navigate = useNavigate();
  const handleSubmit = async (markup: string) => {
    await createPost(markup);
    navigate("/feed");
  };

  return (
    <main>
      <PostEditor onSubmit={handleSubmit} />
    </main>
  );
}
