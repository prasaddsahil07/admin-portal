import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, RefreshCw } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/magazine/article/${id}`);
    //   console.log("res: ", res);
      setArticle(res.data);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/articles');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-gray-200 rounded-lg mb-6"></div>
            
            {/* Category skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
            
            {/* Author skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            
            {/* Banner skeleton */}
            <div className="w-full h-80 bg-gray-200 rounded-2xl mb-8"></div>
            
            {/* Title skeleton */}
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-6"></div>
            
            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Article</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </button>
            <button
              onClick={fetchArticle}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Article Not Found
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Banner Image */}
          {article.bannerImage && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={article.bannerImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="p-8">
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 uppercase font-semibold tracking-wide">
                {article.category}
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={article.authorProfilePic || 'https://avatar.iran.liara.run/public/97'}
                alt={article.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                onError={(e) => {
                  e.target.src = 'https://avatar.iran.liara.run/public/97';
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">{article.authorName}</span>
                </div>
                {article.createdAt && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              {article.subTitle && (
                <h2 className="text-xl text-gray-600 leading-relaxed">
                  {article.subTitle}
                </h2>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;