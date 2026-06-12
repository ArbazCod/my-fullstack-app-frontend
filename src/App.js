import { Routes, Route } from "react-router-dom";

// PAGES
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects"; 

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import AddBlog from "./pages/AddBlog";
import SingleBlog from "./pages/SingleBlog";
import EditBlog from "./pages/EditBlog";

import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/footer.jsx";

// ROUTES
import RequireAuth from "./routes/RequireAuth";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} /> {/* ✅ NEW */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Single Blog */}
        <Route path="/blog/:slug" element={<SingleBlog />} />

        {/* Category & Tag */}
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/tag/:tag" element={<TagPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-3xl mt-20">
              404 Not Found
            </h1>
          }
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;