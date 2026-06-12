import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function TagPage() {

  const { tag } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/posts/tag/${tag}`);
      setPosts(res.data);
    })();
  }, [tag]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">

      <h1 className="text-3xl font-bold mb-4">
        Tag: #{tag}
      </h1>

      <Link to="/blog" className="text-blue-600 underline">
        ← Back to all blogs
      </Link>

      {posts.length === 0 && (
        <p className="mt-6 text-gray-600">
          No posts available with this tag yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {posts.map(post => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

            <p className="text-gray-600 line-clamp-3">
              {post.content.slice(0, 120)}...
            </p>

            <div className="mt-2 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
