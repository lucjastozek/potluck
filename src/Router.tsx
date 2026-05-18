import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreatePostPage from "@/components/editor/CreatePostPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreatePostPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
