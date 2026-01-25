import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import ReceivedRequests from "./pages/ReceivedRequests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";

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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
