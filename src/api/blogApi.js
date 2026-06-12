import api from "./axiosClient";

/**
 * Get Latest Tech Blogs from Dev.to API
 */
export const getTechBlogs = async () => {
  try {
    const response = await fetch(
      "https://dev.to/api/articles?per_page=20"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();

    return data.map((article) => ({
      _id: article.id,
      slug: `api-${article.id}`,
      title: article.title,
      content:
        article.description || "No description available",
      coverImage: article.cover_image || "",
      createdAt: article.published_at,

      author: {
        name: article.user?.name || "Unknown",
        avatar: article.user?.profile_image || "",
      },

      externalUrl: article.url,

      tags: article.tag_list || [],

      category: "technology",

      likes: [],

      isApiBlog: true,
    }));
  } catch (error) {
    console.error("Dev.to API Error:", error);
    return [];
  }
};

/**
 * Get all blogs from MongoDB
 */
export const getAllBlogs = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return [];
  }
};

/**
 * Search blogs
 */
export const searchBlogs = async (query) => {
  try {
    const response = await api.get(
      `/posts/search?q=${encodeURIComponent(query)}`
    );

    return response.data;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

/**
 * Get blogs by category
 */
export const getBlogsByCategory = async (category) => {
  try {
    const response = await api.get(
      `/posts/category/${category}`
    );

    return response.data;
  } catch (error) {
    console.error("Category Error:", error);
    return [];
  }
};

/**
 * Get blogs by tag
 */
export const getBlogsByTag = async (tag) => {
  try {
    const response = await api.get(
      `/posts/tag/${tag}`
    );

    return response.data;
  } catch (error) {
    console.error("Tag Error:", error);
    return [];
  }
};