import React, { useState } from 'react';
import { MoreVertical, AlertCircle, Clock } from 'lucide-react';

const ArticleCard = ({
  article,
  onUpdate,
  onDelete,
  onClick,
  showAdminActions = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(article._id);
    setShowDeleteConfirm(false);
    setShowDropdown(false);
  };

  const handleUpdate = () => {
    onUpdate(article._id);
    setShowDropdown(false);
  };

  const handleCardClick = (e) => {
    // Prevent card click when clicking on admin actions
    if (e.target.closest('.admin-actions')) return;
    onClick(article._id);
  };

  return (
    <div className="relative">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Article</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{article.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Card */}
      <div
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-pink-50"
      >
        {/* Banner Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.bannerImage || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop'}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Admin Actions - Three Dots Menu */}
          {showAdminActions && (
            <div className="admin-actions absolute top-4 right-4">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[140px] z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(article._id);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-purple-50 text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-purple-50 text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content - Only showing required fields */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {article.title}
          </h3>

          {/* Subtitle */}
          {article.subTitle && (
            <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4">
              {article.subTitle}
            </p>
          )}

          {/* Category */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium capitalize">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <img
              src={article.authorProfilePic || 'https://avatar.iran.liara.run/public/97'}
              alt={article.authorName}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://avatar.iran.liara.run/public/97';
              }}
            />
            <span className="text-sm font-medium text-gray-700">By - {article.authorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;