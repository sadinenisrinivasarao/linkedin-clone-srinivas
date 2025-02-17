import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

const Layout = lazy(() => import("./components/layout/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setAuthUser(res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          toast.error(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        setLoadingAuth(false);
      }
    };

    fetchAuthUser();
  }, []);

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {location.pathname !== "/login" && location.pathname !== "/signup" ? (
        <Layout>
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notifications"
              element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/chat"
              element={authUser ? <ChatPage senderId={authUser} /> : <Navigate to="/login" />}
            />
            <Route
              path="/network"
              element={authUser ? <NetworkPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/post/:postId"
              element={authUser ? <PostPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      )}
      <Toaster />
    </Suspense>
  );
}

export default App;
