import { useNavigate } from "react-router-dom";
import PostEditor from "@/components/editor/PostEditor";

export default function EditorTestPage(): JSX.Element {
  const navigate = useNavigate();

  const handleSubmit = (markup: string) => {
    console.log("[editor-test] submitted markup:", markup);
  };

  return (
    <main>
      <PostEditor
        onSubmit={handleSubmit}
        submitLabel="Log markup"
        title="Editor test"
        subtitle="Use this unprotected route to test the editor without logging in."
        onClose={() => navigate("/login")}
        closeLabel="Back to login"
      />
    </main>
  );
}
