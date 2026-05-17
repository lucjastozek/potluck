import RendererPage from "@/pages/renderer/RendererPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RendererPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
