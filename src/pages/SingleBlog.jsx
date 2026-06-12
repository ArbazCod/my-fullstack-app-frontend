import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaShareAlt, FaCopy, FaHeart, FaRegHeart, FaStar, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTrash, FaClock, FaUser } from "react-icons/fa";

export default function SingleBlog() {
  const { slug } = useParams();
  const id = slug;
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const url = window.location.href;

  const getReadTime = (text = "") =>
    Math.max(1, Math.round((text || "").split(" ").length / 180));

  // ---------- LOAD POST ----------
  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts/slug/${id}`);
        setPost(res.data);
        setLikes(res.data.likes?.length || 0);
        setIsLiked(res.data.likes?.includes(user?._id) || false);
      } catch {
        try {
          const res2 = await api.get(`/posts/${id}`);
          setPost(res2.data);
          setLikes(res2.data.likes?.length || 0);
          setIsLiked(res2.data.likes?.includes(user?._id) || false);
        } catch {
          navigate("/blog");
        }
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, navigate, user]);

  // ---------- COMMENTS ----------
  useEffect(() => {
    if (!post?._id) return;
    api.get(`/comments/${post._id}`).then(res => setComments(res.data));
  }, [post]);

  // ---------- REVIEWS ----------
  useEffect(() => {
    if (!post?._id) return;
    api.get(`/reviews/${post._id}`).then(res => setReviews(res.data));
  }, [post]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }
    
    try {
      const res = await api.put(`/posts/like/${post._id}`);
      setLikes(res.data.likes?.length || 0);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/posts/${post._id}`);
      navigate("/blog");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      await api.post("/comments", {
        postId: post._id,
        text: commentText
      });
      setCommentText("");
      const res = await api.get(`/comments/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to add comment");
    }
  };

  const handleAddReview = async () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    
    try {
      await api.post("/reviews", {
        postId: post._id,
        rating,
        comment: reviewText
      });
      setRating(0);
      setReviewText("");
      const res = await api.get(`/reviews/${post._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Review error:", err);
      alert("Failed to add review");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
      alert("Failed to copy link");
    }
  };

  const shareOnPlatform = (platform) => {
    let shareUrl = "";
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post?.title || "Check out this blog post!")}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${post?.title || "Blog Post"} - ${url}`)}`;
        break;
    default:
      return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <FaArrowLeft /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <FaArrowLeft /> Back to Blogs
            </Link>
            
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <FaTrash /> Delete
                </button>
              )}
              
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Options Dropdown */}
      {showShareOptions && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-slideDown">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => shareOnPlatform('facebook')}
                className="flex-1 min-w-[140px] sm:min-w-0 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaFacebook className="text-lg" /> Facebook
              </button>
              <button
                onClick={() => shareOnPlatform('twitter')}
                className="flex-1 min-w-[140px] sm:min-w-0 sm:flex-initial flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaTwitter className="text-lg" /> Twitter
              </button>
              <button
                onClick={() => shareOnPlatform('linkedin')}
                className="flex-1 min-w-[140px] sm:min-w-0 sm:flex-initial flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaLinkedin className="text-lg" /> LinkedIn
              </button>
              <button
                onClick={() => shareOnPlatform('whatsapp')}
                className="flex-1 min-w-[140px] sm:min-w-0 sm:flex-initial flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaWhatsapp className="text-lg" /> WhatsApp
              </button>
              <button
                onClick={copyLink}
                className="flex-1 min-w-[140px] sm:min-w-0 sm:flex-initial flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaCopy className="text-lg" /> Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <Link
                to={`/category/${post.category}`}
                className="inline-flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium px-4 py-2 rounded-full transition-colors text-sm"
              >
                #{post.category}
              </Link>
            )}
            
            {post.tags?.map(tag => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-full transition-colors text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name || "User"}&background=random&size=128`}
                  alt={post.author?.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{post.author?.name || "Anonymous Author"}</p>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <FaClock /> {new Date(post.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span>•</span>
                  <span>{getReadTime(post.content)} min read</span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                isLiked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg sm:prose-xl max-w-none mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 md:p-10">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed text-base sm:text-lg">
              {post.content}
            </div>
          </div>
        </article>

        {/* Ratings & Reviews Section */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ratings & Reviews</h3>
                <div className="flex items-center gap-3">
                  {avgRating && (
                    <>
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
                        <FaStar className="text-yellow-400 text-2xl" />
                      </div>
                      <span className="text-gray-500">•</span>
                    </>
                  )}
                  <span className="text-gray-600">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Rating Stars */}
              {avgRating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-xl ${
                        star <= avgRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4 mb-8">
                {reviews.map(review => (
                  <div key={review._id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <FaStar
                                key={star}
                                className={`text-sm ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-8">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-gray-600">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}

            {/* Add Review Form */}
            {user && (
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Share Your Review</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1"
                        >
                          <FaStar
                            className={`text-2xl ${
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                  
                  <button
                    onClick={handleAddReview}
                    disabled={!rating}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h3>
            {comments.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by latest
              </div>
            )}
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map(comment => (
                <div key={comment._id} className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.author?.name || "Anonymous"}
                        </p>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-8">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-600">No comments yet. Start the conversation!</p>
            </div>
          )}

          {/* Add Comment Form */}
          {user && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <span className="text-sm text-gray-500">Add a public comment</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                />
                
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!user && (
            <div className="text-center py-6 bg-blue-50 rounded-2xl">
              <p className="text-gray-700 mb-3">Want to join the discussion?</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                Login to Comment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <FaArrowLeft /> View All Blogs
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                  isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span>Like ({likes})</span>
              </button>
              
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

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
        
        .prose {
          color: #374151;
        }
        .prose-lg {
          font-size: 1.125rem;
          line-height: 1.77778;
        }
        .prose-xl {
          font-size: 1.25rem;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
