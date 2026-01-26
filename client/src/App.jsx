import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar.jsx";
import Home from "./pages/Home.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import ReceivedRequests from "./pages/ReceivedRequests.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import NewPost from "./pages/NewPost.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import EditPost from "./pages/EditPost.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <ReceivedRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ✅ trocar senha (logado) */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* ✅ reset senha (público) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
