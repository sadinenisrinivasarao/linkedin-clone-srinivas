import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, memo, useCallback, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import "./index.css";

// Lazy Loading Components
const Layout = lazy(() => import("./components/layout/Layout"));
const HomePage = lazy(() => import(/* webpackPrefetch: true */ "./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Skeleton Loader for Better UX
const SkeletonLoader = () => (
  <div className="skeleton">
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
  </div>
);

const MemoizedLayout = memo(Layout);

function App() {
  // Fetch Authenticated User
  const fetchAuthUser = useCallback(async () => {
    const cachedUser = localStorage.getItem("authUser");
    if (cachedUser) return JSON.parse(cachedUser);

    try {
      const { data } = await axiosInstance.get("/auth/me");
      localStorage.setItem("authUser", JSON.stringify(data));
      return data || null;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("authUser");
        return null;
      }
      toast.error(err.response?.data?.message || "Something went wrong");
      return null;
    }
  }, []);

  // React Query for Caching & Optimizing API Calls
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    staleTime: 5 * 60 * 1000, // 5 minutes cache time
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Refetch every minute
  });

  // Prevent Rendering Until User Data is Loaded
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MemoizedLayout>
        <Routes>
          {!authUser && <Route path="/" element={<Navigate to="/login" />} />}
         
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

         
          <Route path="/notifications" element={<ProtectedRoute authUser={authUser}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute authUser={authUser}><ChatPage senderId={authUser} /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute authUser={authUser}><NetworkPage /></ProtectedRoute>} />
          <Route path="/post/:postId" element={<ProtectedRoute authUser={authUser}><PostPage /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute authUser={authUser}><ProfilePage /></ProtectedRoute>} />

        </Routes>
        <Toaster />
      </MemoizedLayout>
    </Suspense>
  );
}

// Memoized Protected Route Component
const ProtectedRoute = memo(({ authUser, children }) => {
  return authUser ? children : <Navigate to="/login" />;
});

export default App;
