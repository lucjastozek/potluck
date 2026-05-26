import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreatePostPage from "@/pages/CreatePostPage";
import FeedPage from "@/pages/feed/FeedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FeedPage />,
  },
  {
    path: "/create",
    element: <CreatePostPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
