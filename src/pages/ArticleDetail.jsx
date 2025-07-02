import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, RefreshCw, Clock, Share2, Bookmark } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams(); // Get article ID from URL params
  const navigate = useNavigate(); // For navigation
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        
        // Check if id exists
        if (!id) {
          throw new Error('Article ID is required');
        }
        
        // console.log('Fetching article with ID:', id); // Debug log
        
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/magazine/article/${id}`);
        
        // console.log('API Response:', res.data.data); // Debug log
        
        if (res.data) {
          setArticle(res.data.data);
        } else {
          throw new Error('No article data received');
        }
        
      } catch (err) {
        console.error('Error fetching article:', err); // Debug log
        setError(err.response?.data?.message || err.message || 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // Add id as dependency

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const formatReadTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">            
            {/* Banner skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-3xl mb-8"></div>
            
            {/* Content skeleton */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-8"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
            >
              <RefreshCw size={18} />
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Article Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        {article.bannerImage && (
          <div className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={article.bannerImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Category Badge on Banner */}
            {article.category && (
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {article.category}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Main Article Content */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Article Header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* Subtitle */}
              {article.subTitle && (
                <h2 className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
                  {article.subTitle}
                </h2>
              )}

              {/* Author Info & Meta */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={article.authorProfilePic || 'https://avatar.iran.liara.run/public/97'}
                    alt={article.authorName || 'Author'}
                    className="w-16 h-16 rounded-full object-cover border-3 border-rose-100 shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://avatar.iran.liara.run/public/97';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-rose-500" />
                      <span className="text-gray-800 font-semibold text-lg">{article.authorName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {article.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatReadTime(article.content)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-xl max-w-none mb-12">
              <div className="text-gray-800 leading-relaxed text-lg" style={{ lineHeight: '1.8' }}>
                {article.content && article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Related Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium hover:from-rose-200 hover:to-pink-200 transition-all duration-200 cursor-pointer hover:scale-105 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center">
          <button
              onClick={handleBack}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore More
            </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;