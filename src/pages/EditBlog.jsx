import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  X,
  Maximize2,
  Minimize2,
  Type,
  AlignLeft,
  Loader2
} from "lucide-react";
import api from "../api/axiosClient";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalData, setOriginalData] = useState({ title: "", content: "" });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Auto-save timer ref - fixed: use useRef instead of useState
  const autoSaveTimerRef = useRef(null);

  // Load blog data
  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/posts/${id}`);
        const blogData = {
          title: res.data.title,
          content: res.data.content
        };
        setTitle(blogData.title);
        setContent(blogData.content);
        setOriginalData(blogData);
      } catch (err) {
        setError("Blog not found or you don't have permission to edit it");
        setTimeout(() => navigate("/dashboard"), 3000);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();

    // Cleanup auto-save on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  // Update word and character count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(content.length);
  }, [content]);

  // Handle save function - memoized with useCallback
  const handleSave = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await api.put(`/posts/${id}`, { 
        title: title.trim(), 
        content: content.trim() 
      });
      setOriginalData({ title: title.trim(), content: content.trim() });
      setSuccessMessage("Blog updated successfully!");
      
      setTimeout(() => {
        setSuccessMessage("");
        navigate(`/blog/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [title, content, id, navigate]);

  // Auto-save functionality - fixed dependencies
  useEffect(() => {
    if (loading) return;

    const hasChanges = title !== originalData.title || content !== originalData.content;
    
    if (hasChanges && title.trim() && content.trim()) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          setAutoSaveStatus("Saving...");
          await api.put(`/posts/${id}`, { title, content });
          setOriginalData({ title, content });
          setLastSaved(new Date());
          setAutoSaveStatus("Draft saved");
          
          setTimeout(() => setAutoSaveStatus(""), 3000);
        } catch (err) {
          setAutoSaveStatus("Auto-save failed");
          setTimeout(() => setAutoSaveStatus(""), 3000);
        }
      }, 2000);
    }

    // No cleanup needed here as it's handled in the load useEffect
  }, [title, content, loading, id, originalData.title, originalData.content]);

  const handleCancel = () => {
    const hasChanges = title !== originalData.title || content !== originalData.content;
    
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(`/blog/${id}`);
      }
    } else {
      navigate(`/blog/${id}`);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearError = () => setError("");

  // Keyboard shortcuts - fixed: added handleSave to dependencies
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, isFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading blog...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen bg-gray-50 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </motion.button>
              
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-[300px]">
                  Edit Blog
                </h1>
                {lastSaved && (
                  <p className="text-xs text-gray-500">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Auto-save status */}
              <AnimatePresence>
                {autoSaveStatus && (
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="hidden sm:inline text-xs text-gray-500"
                  >
                    {autoSaveStatus}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* View blog button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`/blog/${id}`, '_blank')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex items-center space-x-1"
                title="Preview blog"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-sm hidden lg:inline">Preview</span>
              </motion.button>

              {/* Fullscreen toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                ) : (
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </motion.button>

              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="flex-shrink-0 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Title input */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Type className="w-4 h-4 text-gray-400" />
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </label>
            </div>
            <input
              className="w-full text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title..."
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {title.length}/200 characters
              </span>
            </div>
          </div>

          {/* Content textarea */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlignLeft className="w-4 h-4 text-gray-400" />
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </label>
            </div>
            <textarea
              className={`w-full resize-none focus:outline-none text-gray-700 placeholder-gray-300 leading-relaxed text-sm sm:text-base ${
                isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-48 sm:h-64 lg:h-96'
              }`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here... You can use markdown for formatting."
            />
            
            {/* Word count and stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
              <div className="flex space-x-4 text-xs text-gray-400">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="text-xs text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd>
                <span className="ml-1">to save</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => window.open(`/blog/${id}`, '_blank')}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Preview</span>
            </button>
            
            {autoSaveStatus && (
              <span className="text-xs text-gray-500">{autoSaveStatus}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}