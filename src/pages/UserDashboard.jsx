import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosClient";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaFileAlt,
  FaHome,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaTrash,
  FaEdit,
  FaEye,
  FaHeart,
  FaCalendarAlt,
  FaUpload,
  FaSpinner,
  FaPen,
  FaEnvelope,
  FaCrown,
  FaSave
} from "react-icons/fa";

export default function UserDashboard() {
  const { user, setUser, logout } = useContext(AuthContext);

  const [tab, setTab] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  // -------- DATE FORMATTER --------
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'N/A';
    }
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'N/A';
    }
  };

  // -------- TOAST --------
  const toast = (msg, type = "success") => {
    // Remove existing toasts
    document.querySelectorAll('.custom-toast').forEach(el => el.remove());
    
    const el = document.createElement("div");
    el.className = `custom-toast fixed top-6 right-4 md:right-6 px-6 py-3 rounded-xl shadow-lg text-white z-50 
      transform transition-all duration-300 translate-x-0 opacity-100
      ${type === "error" 
        ? "bg-gradient-to-r from-red-500 to-red-600" 
        : "bg-gradient-to-r from-green-500 to-emerald-600"}`;
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transform = "translateX(100%)";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, 2500);
  };

  // -------- LOAD USER DATA --------
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setBio(user.bio || "");

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/posts");
        const myPosts = res.data.filter(
          (p) => p.author && p.author._id === user._id
        );
        setPosts(myPosts);
      } catch (err) {
        console.error("Error loading posts:", err);
        toast("Failed to load posts", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // -------- UPLOAD AVATAR --------
  const uploadAvatar = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast("Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Image size should be less than 5MB", "error");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await api.post("/upload/image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const imageUrl = uploadRes.data.url || uploadRes.data.imageUrl;

      if (!imageUrl) {
        throw new Error("No image URL in response");
      }

      const updateRes = await api.put("/auth/profile/photo", { 
        imageUrl 
      });

      setUser(updateRes.data.user || updateRes.data);
      toast("Profile photo updated successfully!");
      
      // Refresh posts to update avatars
      const postsRes = await api.get("/posts");
      const myPosts = postsRes.data.filter(
        (p) => p.author && p.author._id === user._id
      );
      setPosts(myPosts);

    } catch (error) {
      console.error("Avatar upload error:", error);
      toast(error.response?.data?.message || "Avatar upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // -------- SAVE PROFILE --------
  const saveProfile = async () => {
    if (!name.trim()) {
      toast("Name is required", "error");
      return;
    }

    try {
      setSaving(true);
      
      const res = await api.put("/auth/profile", { 
        name: name.trim(), 
        bio: bio.trim() 
      });
      
      if (res.data.user) {
        setUser(res.data.user);
        toast("Profile updated successfully!");
      } else {
        setUser(res.data);
        toast("Profile updated successfully!");
      }

    } catch (error) {
      console.error("Profile save error:", error);
      toast(error.response?.data?.message || "Profile update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // -------- DELETE BLOG --------
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast("Blog deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast(error.response?.data?.message || "Delete failed", "error");
    }
  };

  // -------- DARK MODE --------
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [dark]);

  const totalLikes = posts.reduce(
    (sum, p) => sum + (p.likes?.length || 0),
    0
  );

  const totalComments = posts.reduce(
    (sum, p) => sum + (p.comments?.length || 0),
    0
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${dark ? "dark" : ""}`}>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-50">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>

        <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>

        <button 
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? 
            <FaSun size={18} className="text-yellow-400" /> : 
            <FaMoon size={18} className="text-gray-600" />
          }
        </button>
      </div>

      {/* SIDEBAR OVERLAY (MOBILE) */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-full w-72 md:w-64
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&bold=true`
                }
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => fileRef.current?.click()}
                alt={user?.name || "User"}
              />
              
              {/* Upload overlay */}
              <div 
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <FaUpload className="text-white text-xl" />
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <FaSpinner className="text-white text-xl animate-spin" />
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) uploadAvatar(file);
                  e.target.value = "";
                }}
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
              {user?.name || "User"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
              <FaEnvelope size={12} /> {user?.email}
            </p>

            <div className="mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold">
                <FaCrown size={10} /> Creator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => { setTab("dashboard"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${tab === "dashboard" 
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
          >
            <FaHome size={18} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => { setTab("posts"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${tab === "posts" 
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
          >
            <FaFileAlt size={18} />
            <span className="font-medium">My Blogs</span>
            <span className="ml-auto bg-white/20 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
              {posts.length}
            </span>
          </button>

          <button 
            onClick={() => { setTab("profile"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${tab === "profile" 
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
          >
            <FaUser size={18} />
            <span className="font-medium">Profile Settings</span>
          </button>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setDark(!dark)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
              <span className="font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors mt-1"
            >
              <FaSignOutAlt size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Member since {formatMonthYear(user?.createdAt)}
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16 md:mt-0 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
            Manage your blogs and profile settings
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {!loading && tab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FaFileAlt className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Blogs</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{posts.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <FaHeart className="text-red-600 dark:text-red-400 text-lg md:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalLikes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FaPen className="text-green-600 dark:text-green-400 text-lg md:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Comments</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalComments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-lg md:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {formatMonthYear(user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Recent Blogs</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = "/add-blog"}
                    className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-shadow text-sm"
                  >
                    New Blog
                  </button>
                  <button 
                    onClick={() => setTab("posts")}
                    className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                  >
                    View All
                  </button>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-5xl md:text-6xl mb-4">📝</div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No blogs yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm md:text-base">Start writing your first blog post!</p>
                  <button 
                    onClick={() => window.location.href = "/add-blog"}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-sm md:text-base"
                  >
                    Create Your First Blog
                  </button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 md:gap-4 mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaHeart size={10} /> {post.likes?.length || 0}
                          </span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2 self-end sm:self-center">
                        <button
                          onClick={() => window.location.href = `/blog/${post._id}`}
                          className="p-1.5 md:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition text-xs"
                          aria-label="View blog"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="p-1.5 md:p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition text-xs"
                          aria-label="Delete blog"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* POSTS TAB */}
        {!loading && tab === "posts" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Blogs</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                  Manage all your published blog posts
                </p>
              </div>
              <button 
                onClick={() => window.location.href = "/add-blog"}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg md:rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2 text-sm md:text-base w-full md:w-auto justify-center"
              >
                <FaPen /> New Blog
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="text-gray-400 dark:text-gray-500 text-6xl md:text-7xl mb-6">📝</div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  No blogs published yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm md:text-base px-4">
                  Start sharing your thoughts and ideas with the world. Create your first blog post now!
                </p>
                <button 
                  onClick={() => window.location.href = "/add-blog"}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-xl transition-shadow text-sm md:text-base"
                >
                  Create Your First Blog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                          {post.title}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full whitespace-nowrap">
                          {post.likes?.length || 0} Likes
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-2 text-sm md:text-base">
                        {post.content?.substring(0, 120)}...
                      </p>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={12} /> 
                            <span className="hidden sm:inline">
                              {formatDate(post.createdAt)}
                            </span>
                            <span className="sm:hidden">
                              {post.createdAt ? formatDate(post.createdAt).split(' ').slice(0, 2).join(' ') : 'N/A'}
                            </span>
                          </span>
                          <span className="hidden md:inline">•</span>
                          <span className="flex items-center gap-1">
                            <FaHeart size={12} /> {post.likes?.length || 0}
                          </span>
                        </div>
                        <div className="flex gap-1 md:gap-2 self-stretch md:self-center">
                          <button
                            onClick={() => window.location.href = `/blog/${post._id}`}
                            className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-1 text-xs md:text-sm"
                          >
                            <FaEye size={12} /> <span className="hidden sm:inline">View</span>
                          </button>
                          <button
                            onClick={() => window.location.href = `/edit-blog/${post._id}`}
                            className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition flex items-center justify-center gap-1 text-xs md:text-sm"
                          >
                            <FaEdit size={12} /> <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => deletePost(post._id)}
                            className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition flex items-center justify-center gap-1 text-xs md:text-sm"
                          >
                            <FaTrash size={12} /> <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {!loading && tab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
              Profile Settings
            </h1>
            
            <div className="max-w-2xl space-y-6 md:space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                <div className="relative">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&bold=true`
                    }
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    alt={user?.name || "User"}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 md:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
                    aria-label="Upload profile picture"
                  >
                    <FaUpload size={12} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Click the upload button to change your photo. JPG, PNG up to 5MB.
                  </p>
                  {uploading && (
                    <p className="text-blue-500 text-sm mt-2 flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Uploading...
                    </p>
                  )}
                </div>
              </div>

              {/* Name & Bio Form */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-2">
                    This will be displayed on your public profile. Max 500 characters.
                  </p>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg md:rounded-xl font-medium hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>

              {/* Account Info */}
              <div className="pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Account Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Email</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate ml-2">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Account Type</span>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs md:text-sm rounded-full">
                      Creator
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Member Since</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
