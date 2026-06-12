import { useState } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Folder,
  Loader2,
  Sparkles,
  X,
  Check,
  AlertCircle,
  Calendar,
  Globe
} from "lucide-react";

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
    excerpt: "",
    isFeatured: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState([]);

  const navigate = useNavigate();

  const categories = [
    "Technology", "Business", "Health", "Lifestyle", "Travel",
    "Education", "Entertainment", "Sports", "Science", "Food"
  ];

  const popularTags = [
    "React", "JavaScript", "AI", "Web Development", "Design",
    "Startup", "Productivity", "Coding", "UX", "Mobile"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "content") {
      setCharacterCount(value.length);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const addTag = (tag) => {
    if (tag.trim() && !tagsList.includes(tag.trim())) {
      setTagsList([...tagsList, tag.trim()]);
      setTagInput("");
      setFormData(prev => ({
        ...prev,
        tags: [...tagsList, tag.trim()].join(", ")
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tagsList.filter(tag => tag !== tagToRemove);
    setTagsList(newTags);
    setFormData(prev => ({
      ...prev,
      tags: newTags.join(", ")
    }));
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    
    if (characterCount < 100) {
      setError("Content should be at least 100 characters");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let coverImage = null;

      // Upload image if selected
      if (image) {
        const form = new FormData();
        form.append("image", image);

        const uploadRes = await api.post("/upload/image", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        coverImage = uploadRes.data.url;
      }

      // Prepare tags
      const finalTags = tagsList.length > 0 ? tagsList : formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);

      // Create blog
      await api.post("/posts", {
        ...formData,
        tags: finalTags.join(", "),
        coverImage,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "..."
      });

      setSuccess("🎉 Blog published successfully! Redirecting...");

      // Reset form
      setFormData({
        title: "",
        category: "",
        tags: "",
        content: "",
        excerpt: "",
        isFeatured: false
      });
      setTagsList([]);
      setImage(null);
      setImagePreview(null);
      setCharacterCount(0);

      // Redirect after 2 seconds
      setTimeout(() => navigate("/blog"), 2000);

    } catch (err) {
      console.log("Error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to publish blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
        </div>
        <p className="text-gray-600">
          Share your knowledge and experiences with the community
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg animate-slideDown">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6" />
              <div>
                <p className="font-semibold">{success}</p>
                <p className="text-sm opacity-90">Your blog is now live!</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-lg animate-slideDown">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={submitBlog} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Title */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Catchy title that grabs attention..."
                  className="w-full p-4 text-lg border-0 focus:ring-0 bg-gray-50 rounded-xl focus:bg-white transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Keep it concise and descriptive
                </p>
              </div>

              {/* Content */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content
                  </label>
                  <span className={`text-xs font-medium ${characterCount < 100 ? 'text-red-500' : 'text-green-500'}`}>
                    {characterCount}/100 characters
                  </span>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start writing your amazing content here..."
                  className="w-full h-64 p-4 border-0 focus:ring-0 bg-gray-50 rounded-xl focus:bg-white transition-colors resize-none"
                  required
                />
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Public</span>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of your blog post (optional)"
                  className="w-full h-24 p-4 border-0 focus:ring-0 bg-gray-50 rounded-xl focus:bg-white transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Displayed on blog cards. Auto-generated if empty.
                </p>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Image Upload */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Cover Image
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl mb-3"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-blue-500" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border-0 bg-gray-50 rounded-xl focus:ring-0 focus:bg-white transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
                    placeholder="Add tags..."
                    className="flex-1 p-2 border-0 bg-gray-50 rounded-lg focus:ring-0 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Tags */}
                {tagsList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagsList.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Popular Tags */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Post Toggle */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Featured Post
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Highlight on homepage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Publish Blog Post
                  </span>
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate("/blog")}
                className="w-full p-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Preview Note */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700">Pro Tip</p>
              <p className="text-sm text-gray-600">
                Use clear headings, images, and tags to improve readability and discoverability.
                Featured posts appear on the homepage!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
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
      `}</style>
    </div>
  );
}
 



