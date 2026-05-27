import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppShell from "@/components/navigation/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import FeedPage from "@/pages/feed/FeedPage";
import PostDetailPage from "@/pages/feed/PostDetailPage";
import ProfileSettingsPage from "@/pages/profile/ProfileSettingsPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyPostsPage from "@/pages/my-posts/MyPostsPage";
import EditPostPage from "@/pages/edit-post/EditPostPage";
import InboxPage from "@/pages/messages/InboxPage";
import ConversationPage from "@/pages/messages/ConversationPage";
import RoleRoute from "@/components/auth/RoleRoute";
import ModerationPage from "@/pages/moderation/ModerationPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route
            path="/create"
            element={<Navigate to="/feed?compose=1" replace />}
          />
          <Route
            path="/settings"
            element={<Navigate to="/profile" replace />}
          />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/posts/drafts" element={<MyPostsPage />} />
            <Route path="/posts/edit/:id" element={<EditPostPage />} />
            <Route path="/messages" element={<InboxPage />} />
            <Route path="/messages/:id" element={<ConversationPage />} />
            <Route
              path="/moderation"
              element={
                <RoleRoute allowedRoles={["MODERATOR", "ADMIN"]}>
                  <ModerationPage />
                </RoleRoute>
              }
            />
            <Route
              path="/posts/new"
              element={<Navigate to="/feed?compose=1" replace />}
            />
            <Route path="/profile" element={<ProfileSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
