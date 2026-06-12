import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { getTechBlogs } from "../api/blogApi";

export default function Blog() {
  const { user, isAdmin } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [blogSource, setBlogSource] = useState("userblogs"); // Changed from "myblogs"
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const getReadTime = (text = "") => {
    const words = (text || "").split(" ").length;
    return Math.max(1, Math.round(words / 180));
  };

  // Load User Blogs initially (default)
  useEffect(() => {
    loadUserBlogs();
  }, []);

  const loadUserBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      console.log("Loaded user posts:", res.data);
      setPosts(res.data);
      setFiltered(res.data);
      setBlogSource("userblogs");
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(post => post.category).filter(Boolean))];
      setCategories(["all", ...uniqueCategories]);
      
      // Reset filters
      setSearch("");
      setActiveCategory("all");
      setSortBy("latest");
    } catch (err) {
      console.log("LOAD USER POSTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

 const loadTrendingBlogs = async () => {
  try {
    setLoading(true);

    console.log("🔥 Loading trending blogs...");

    const blogs = await getTechBlogs();

    console.log("🔥 TRENDING BLOGS:", blogs);
    console.log("🔥 TRENDING COUNT:", blogs.length);

    setPosts(blogs);
    setFiltered(blogs);
    setBlogSource("trending");

    const uniqueCategories = [
      ...new Set(
        blogs.map((post) => post.category).filter(Boolean)
      ),
    ];

    setCategories(["all", ...uniqueCategories]);

    setSearch("");
    setActiveCategory("all");
    setSortBy("latest");

    console.log("✅ Trending blogs loaded successfully");
  } catch (err) {
    console.error("❌ TRENDING BLOGS ERROR:", err);
  } finally {
    setLoading(false);
  }
};

  // IMPORTANT: handleSearch only does LOCAL filtering, NO API calls
  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      // Apply current category filter if active
      if (activeCategory === "all") {
        setFiltered(posts);
      } else {
        const filteredByCategory = posts.filter(post => 
          post.category && post.category.toLowerCase() === activeCategory.toLowerCase()
        );
        setFiltered(filteredByCategory);
      }
      return;
    }

    // First filter by category if active, then by search
    let basePosts = posts;
    if (activeCategory !== "all") {
      basePosts = posts.filter(post => 
        post.category && post.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter from current posts array (works for both sources)
    const filteredPosts = basePosts.filter(post => {
      const searchLower = value.toLowerCase();
      return (
        (post.title && post.title.toLowerCase().includes(searchLower)) ||
        (post.content && post.content.toLowerCase().includes(searchLower)) ||
        (post.tags && post.tags.some(tag => tag && tag.toLowerCase().includes(searchLower))) ||
        (post.category && post.category.toLowerCase().includes(searchLower))
      );
    });
    
    setFiltered(filteredPosts);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      // If there's a search term, filter by search only
      if (search.trim()) {
        handleSearch(search);
      } else {
        setFiltered(posts);
      }
    } else {
      const filteredByCategory = posts.filter(post => 
        post.category && post.category.toLowerCase() === category.toLowerCase()
      );
      
      // Apply search filter on top of category filter if search exists
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const filteredBySearchAndCategory = filteredByCategory.filter(post => {
          return (
            (post.title && post.title.toLowerCase().includes(searchLower)) ||
            (post.content && post.content.toLowerCase().includes(searchLower)) ||
            (post.tags && post.tags.some(tag => tag && tag.toLowerCase().includes(searchLower))) ||
            (post.category && post.category.toLowerCase().includes(searchLower))
          );
        });
        setFiltered(filteredBySearchAndCategory);
      } else {
        setFiltered(filteredByCategory);
      }
    }
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sorted = [...filtered].sort((a, b) => {
      if (criteria === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (criteria === "popular") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });
    setFiltered(sorted);
  };

  const handleLike = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    try {
      const isLiked = likedPosts.has(postId);
      
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const updatedLikes = isLiked 
            ? (post.likes || []).filter(like => like !== user._id)
            : [...(post.likes || []), user._id];
          return { ...post, likes: updatedLikes };
        }
        return post;
      }));

      setFiltered(prev => prev.map(post => {
        if (post._id === postId) {
          const updatedLikes = isLiked 
            ? (post.likes || []).filter(like => like !== user._id)
            : [...(post.likes || []), user._id];
          return { ...post, likes: updatedLikes };
        }
        return post;
      }));

      if (isLiked) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setLikedPosts(prev => new Set(prev.add(postId)));
      }

      await api.put(`/posts/like/${postId}`);
    } catch (err) {
      console.log("LIKE ERROR:", err);
    }
  };

  const handleDelete = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setFiltered(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      
      {/* SOURCE TOGGLE BUTTONS - Updated labels */}
      <div className="max-w-7xl mx-auto mb-4 flex gap-3">
        <button
          onClick={loadUserBlogs}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
            blogSource === "userblogs" 
              ? "bg-blue-700 shadow-lg ring-2 ring-blue-300" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          👤 User Blogs
        </button>

        <button
          onClick={loadTrendingBlogs}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
            blogSource === "trending" 
              ? "bg-purple-700 shadow-lg ring-2 ring-purple-300" 
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          🔥 Trending Blogs
        </button>
      </div>

      {/* HERO SECTION - Updated text based on source */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 sm:p-6 md:p-8 lg:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-yellow-300 font-semibold text-sm sm:text-base">
                {blogSource === "trending" ? "🔥 Trending Tech" : "👤 Community Stories"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
              {blogSource === "trending" ? "Trending Tech Articles" : "Community Blogs"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl">
              {blogSource === "trending" 
                ? "Latest AI, Web Development, Programming and Technology news."
                : "Read articles written by developers and registered users."
              }
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl"></div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          
          <div className="relative flex-1">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search topics, titles, or keywords..."
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-md transition-shadow text-sm sm:text-base"
          >
            <span>⚙️ Filters</span>
            <span className={`transition-transform ${showFilters ? 'rotate-90' : ''}`}>›</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm animate-slideDown">
            
            <div className="mb-6 sm:mb-0">
              <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">🏷️ Categories</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === "all" ? "All Topics" : `#${category}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200 my-4 sm:hidden"></div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">📈 Sort By</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {["latest", "popular"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSort(option)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      sortBy === option
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS COUNT - Updated text */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div className="text-gray-600 text-sm sm:text-base">
            Showing <span className="font-bold text-blue-600">{filtered.length}</span> article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== "all" && ` in #${activeCategory}`}
            {blogSource === "trending" && " from trending tech"}
          </div>
          {activeCategory !== "all" && (
            <button
              onClick={() => handleCategoryFilter("all")}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* NO RESULTS */}
      {filtered.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-12 sm:py-16 px-4">
          <div className="text-gray-400 mb-3 sm:mb-4 text-4xl sm:text-5xl md:text-6xl">
            🔍
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
            {search ? `No results for "${search}"` : "There are no blog posts yet."}
          </p>
          {isAdmin && blogSource === "userblogs" && (
            <Link
              to="/add-blog"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              ✨ Create Your First Blog
            </Link>
          )}
        </div>
      )}

      {/* BLOG CARDS */}
      {filtered.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filtered.map((post) => {
              // For trending blogs, use external link; for user blogs, use internal routing
              if (blogSource === "trending") {
                return (
                  <a
                    key={post._id}
                    href={post.externalUrl || post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 block"
                  >
                    {post.coverImage && (
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          {post.category && (
                            <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                              #{post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-5 md:p-6">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                        {post.content?.substring(0, 80) || "No description available"}...
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium"
                            >
                              🏷️ {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-gray-400 text-xs self-center">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              post?.author?.avatar ||
                              `https://ui-avatars.com/api/?name=${post?.author?.name || "User"}&background=random`
                            }
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                            }}
                          />
                          <div>
                            <div className="font-semibold text-xs text-gray-900 truncate max-w-[80px] sm:max-w-[100px]">
                              {post.author?.name || "Anonymous"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>📅</span>
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              }) : 'Recently'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <span>📖</span>
                            {getReadTime(post.content)} min
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              }

              // User Blogs - use internal Link
              return (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug || post._id}`}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 block"
                >
                  {post.coverImage && (
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        {post.category && (
                          <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            #{post.category}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 md:p-6">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                      {post.content?.substring(0, 80) || "No description available"}...
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            🏷️ {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-gray-400 text-xs self-center">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            post?.author?.avatar ||
                            `https://ui-avatars.com/api/?name=${post?.author?.name || "User"}&background=random`
                          }
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                          }}
                        />
                        <div>
                          <div className="font-semibold text-xs text-gray-900 truncate max-w-[80px] sm:max-w-[100px]">
                            {post.author?.name || "Anonymous"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>📅</span>
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) : 'Recently'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <span>📖</span>
                          {getReadTime(post.content)} min
                        </div>

                        {blogSource === "userblogs" && (
                          <div 
                            className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                            onClick={(e) => handleLike(post._id, e)}
                            title="Like this post"
                          >
                            <span className="text-base">
                              {likedPosts.has(post._id) || (post.likes || []).includes(user?._id) ? '❤️' : '🤍'}
                            </span>
                            <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                          </div>
                        )}

                      {(isAdmin || user?._id === post.author?._id) &&
  blogSource === "userblogs" && (
    <>
      <Link
        to={`/edit-blog/${post._id}`}
        onClick={(e) => e.stopPropagation()}
        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit post"
      >
        ✏️
      </Link>

      <button
        onClick={(e) => handleDelete(post._id, e)}
        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete post"
      >
        🗑️
      </button>
    </>
)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD BLOG BUTTON - Only show for User Blogs */}
      {user && blogSource === "userblogs" && (
        <Link
          to="/add-blog"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 group z-50"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-110">
              <span className="text-xl sm:text-2xl">+</span>
            </button>
          </div>
        </Link>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
}