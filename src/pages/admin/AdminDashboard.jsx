import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosClient";

import {
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiStar,
  FiTrendingUp,
  FiTrash2,
  FiShield,
  FiX,
  FiCheck,
  FiMenu,
  FiHome,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth < 1024);

  const [totalUsers, setTotalUsers] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalReviews: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView(isMobile);
      if (!isMobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on tab change for mobile
  useEffect(() => {
    if (mobileView) {
      setSidebarOpen(false);
    }
  }, [tab, mobileView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // -------- fetch stats ----------
  const loadStats = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [usersCountRes, usersRes, postsRes, commentsRes, reviewsRes] = await Promise.all([
        api.get("/auth/stats/total-users"),
        api.get("/auth/stats/users"),
        api.get("/posts"),
        api.get("/comments"),
        api.get("/reviews")
      ]);

      setTotalUsers(usersCountRes.data?.totalUsers || 0);

      const list = usersRes.data?.users ?? usersRes.data ?? [];
      setUsersList(Array.isArray(list) ? list : []);

      setPosts(postsRes.data || []);
      setComments(commentsRes.data || []);
      setReviews(reviewsRes.data || []);

      setStats({
        totalPosts: postsRes.data?.length || 0,
        totalComments: commentsRes.data?.length || 0,
        totalReviews: reviewsRes.data?.length || 0
      });

    } catch (err) {
      console.error("Error loading stats:", err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // -------- delete user ----------
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
     await api.delete(`/auth/delete/${userId}`);
      
      setUsersList(prev => prev.filter(u => u._id !== userId));
      setTotalUsers(prev => prev - 1);
      
      showSuccess(`User "${userName}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  // -------- change user role ----------
  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    if (!window.confirm(`Change role from ${currentRole} to ${newRole}?`)) {
      return;
    }

    try {
      await api.put(`/auth/change-role/${userId}`, { role: newRole });
      
      setUsersList(prev => prev.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));

      showSuccess(`Role changed to ${newRole} successfully!`);
    } catch (err) {
      console.error("Error changing role:", err);
      setError("Failed to change role");
    }
  };

  // -------- delete post ----------
  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Delete post "${postTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      showSuccess(`Post "${postTitle}" deleted!`);
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  // -------- delete comment ----------
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      setStats(prev => ({ ...prev, totalComments: prev.totalComments - 1 }));
      showSuccess("Comment deleted!");
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  // -------- delete review ----------
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      setStats(prev => ({ ...prev, totalReviews: prev.totalReviews - 1 }));
      showSuccess("Review deleted!");
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  // -------- helpers ----------
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: <FiHome size={20} /> },
    { id: "users", label: "Users", icon: <FiUsers size={20} />, count: totalUsers },
    { id: "posts", label: "Posts", icon: <FiFileText size={20} />, count: stats.totalPosts },
    { id: "comments", label: "Comments", icon: <FiMessageSquare size={20} />, count: stats.totalComments },
    { id: "reviews", label: "Reviews", icon: <FiStar size={20} />, count: stats.totalReviews },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-emerald-500 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && mobileView && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-emerald-900
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:block
          flex flex-col overflow-y-auto
          shadow-2xl lg:shadow-xl
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <FiShield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Admin Panel</h1>
                <p className="text-emerald-400 text-xs">Management Console</p>
              </div>
            </div>
            {mobileView && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white p-1"
              >
                <FiX size={24} />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                {user?.role || "Admin"}
              </span>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                if (mobileView) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${tab === item.id
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-white shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className={tab === item.id ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400 transition-colors"}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${tab === item.id
                    ? "bg-emerald-500/30 text-emerald-300"
                    : "bg-gray-700 text-gray-400 group-hover:bg-gray-600"
                  }
                `}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={loadStats}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 text-sm"
          >
            <FiRefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              {mobileView && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiMenu size={24} className="text-gray-700" />
                </button>
              )}
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                  {tab === "overview" ? "Dashboard Overview" : `Manage ${tab}`}
                </h2>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {tab === "users" && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={loadStats}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <FiRefreshCw size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 lg:px-8 pt-4 space-y-3">
          {success && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 animate-slideDown">
              <div className="flex items-center gap-3">
                <FiCheck className="text-white" size={20} />
                <span className="font-medium">{success}</span>
              </div>
              <button onClick={() => setSuccess("")} className="text-white/80 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-red-500/20 animate-slideDown">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-white" size={20} />
                <span className="font-medium">{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-white/80 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {/* ===== OVERVIEW TAB ===== */}
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Users"
                  value={totalUsers}
                  icon={<FiUsers size={24} />}
                  color="blue"
                  trend="+12%"
                  subtitle="Active accounts"
                />
                <StatsCard
                  title="Total Posts"
                  value={stats.totalPosts}
                  icon={<FiFileText size={24} />}
                  color="emerald"
                  trend="+8%"
                  subtitle="Published content"
                />
                <StatsCard
                  title="Total Comments"
                  value={stats.totalComments}
                  icon={<FiMessageSquare size={24} />}
                  color="violet"
                  trend="+15%"
                  subtitle="User engagement"
                />
                <StatsCard
                  title="Total Reviews"
                  value={stats.totalReviews}
                  icon={<FiStar size={24} />}
                  color="amber"
                  trend="+5%"
                  subtitle="User feedback"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
                      <p className="text-sm text-gray-500 mt-1">Latest published content</p>
                    </div>
                    <button
                      onClick={() => setTab("posts")}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {posts.slice(0, 5).map(post => (
                    <div key={post._id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                            {post.coverImage ? (
                              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiFileText size={24} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 truncate">{post.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1 lg:line-clamp-2">
                              {post.content?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>By {post.author?.name}</span>
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post._id, post.title)}
                          className="self-start sm:self-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Delete post"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="p-12 text-center">
                      <FiFileText className="mx-auto text-gray-300" size={48} />
                      <p className="mt-4 text-gray-500 font-medium">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS TAB ===== */}
          {tab === "users" && (
            <div className="space-y-6">
              {/* Mobile Search & Filter */}
              <div className="flex sm:hidden gap-3 flex-col">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Users Grid - Mobile Cards */}
              <div className="lg:hidden grid gap-4">
                {filteredUsers.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random&size=48`}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                            {u._id === user._id && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full flex-shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        u.role === 'admin' 
                          ? 'bg-violet-100 text-violet-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleChangeRole(u._id, u.role)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        Make {u.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <FiUsers className="mx-auto text-gray-300" size={48} />
                    <p className="mt-4 text-gray-500 font-medium">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </div>
                )}
              </div>

              {/* Users Table - Desktop */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-4 font-semibold text-gray-700 text-sm">User</th>
                        <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700 text-sm">Role</th>
                        <th className="text-left p-4 font-semibold text-gray-700 text-sm">Joined</th>
                        <th className="text-left p-4 font-semibold text-gray-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                  src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random&size=40`}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-medium text-gray-900 truncate">{u.name}</span>
                                {u._id === user._id && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full flex-shrink-0">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' 
                                ? 'bg-violet-100 text-violet-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500 text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleChangeRole(u._id, u.role)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  u.role === 'admin'
                                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                Make {u.role === 'admin' ? 'User' : 'Admin'}
                              </button>
                              {u._id !== user._id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-16">
                    <FiUsers className="mx-auto text-gray-300" size={48} />
                    <p className="mt-4 text-gray-500 font-medium">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== POSTS TAB ===== */}
          {tab === "posts" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {posts.map(post => (
                <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiFileText size={48} />
                      </div>
                    )}
                    <button
                      onClick={() => handleDeletePost(post._id, post.title)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete post"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4 lg:p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {post.content?.substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author?.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <FiFileText className="mx-auto text-gray-300" size={48} />
                  <p className="mt-4 text-gray-500 font-medium">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {/* ===== COMMENTS TAB ===== */}
          {tab === "comments" && (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.name}&size=40`}
                          alt={comment.author?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{comment.author?.name}</span>
                          <span className="text-gray-400 text-sm">on</span>
                          <span className="text-emerald-600 text-sm font-medium truncate">
                            {comment.post?.title || 'Blog Post'}
                          </span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-xl p-3 mt-2">{comment.text}</p>
                        <div className="text-sm text-gray-500 mt-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="self-end sm:self-start p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete comment"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <FiMessageSquare className="mx-auto text-gray-300" size={48} />
                  <p className="mt-4 text-gray-500 font-medium">No comments yet</p>
                </div>
              )}
            </div>
          )}

          {/* ===== REVIEWS TAB ===== */}
          {tab === "reviews" && (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={review.author?.avatar || `https://ui-avatars.com/api/?name=${review.author?.name}&size=40`}
                          alt={review.author?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{review.author?.name}</span>
                          <span className="text-gray-400 text-sm">on</span>
                          <span className="text-emerald-600 text-sm font-medium truncate">
                            {review.post?.title || 'Blog Post'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span
                                key={star}
                                className="text-xl"
                                style={{ color: star <= review.rating ? '#f59e0b' : '#e5e7eb' }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-700 font-semibold">{review.rating}.0</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-xl p-3">{review.text}</p>
                        <div className="text-sm text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="self-end sm:self-start p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete review"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <FiStar className="mx-auto text-gray-300" size={48} />
                  <p className="mt-4 text-gray-500 font-medium">No reviews yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {mobileView && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
          <div className="flex items-center justify-around px-2 py-2" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-0 ${
                  tab === item.id
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        @media (max-width: 1023px) {
          main {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color, trend, subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', gradient: 'from-violet-500 to-violet-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 lg:p-3 ${c.bg} rounded-xl`}>
          <span className={c.text}>{icon}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
          <FiTrendingUp size={16} />
          <span>{trend}</span>
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</div>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
      <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
    </div>
  );
}