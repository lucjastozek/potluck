import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "@/components/navigation/AppShell";
import CreatePostPage from "@/pages/CreatePostPage";
import FeedPage from "@/pages/feed/FeedPage";
import PostDetailPage from "@/pages/feed/PostDetailPage";
import MyPostsPage from "@/pages/my-posts/MyPostsPage";
import EditPostPage from "@/pages/edit-post/EditPostPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "/feed", element: <FeedPage /> },
      { path: "/post/:id", element: <PostDetailPage /> },
      { path: "/create", element: <CreatePostPage /> },
      { path: "/posts/drafts", element: <MyPostsPage /> },
      { path: "/posts/edit/:id", element: <EditPostPage /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
