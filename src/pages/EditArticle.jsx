import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Tag, Image, Upload, X, ArrowLeft, Save } from 'lucide-react';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    subTitle: '',
    bannerImage: null,
    tags: '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch article data on component mount
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setFetchLoading(true);
        
        // Add the actual API call here
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/magazine/article/${id}`
        );
        
        const article = response.data; // or response.data.article, depending on your API response structure
        // console.log(article.data);
        setOriginalData(article.data);
        // console.log(originalData);
        
        setFormData({
          category: article.data.category || '',
          title: article.data.title || '',
          content: article.data.content || '',
          subTitle: article.data.subTitle || '',
          bannerImage: null,
          tags: Array.isArray(article.data.tags) ? article.data.tags.join(', ') : '',
        });

        // Set existing banner image preview
        if (article.data.bannerImage) {
          setBannerPreview(article.data.bannerImage);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setMessage('Error loading article. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bannerImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      bannerImage: null,
    }));
    // Reset to original banner image if exists
    setBannerPreview(originalData?.bannerImage || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    // Only append fields that have values
    if (formData.category) payload.append('category', formData.category);
    if (formData.title) payload.append('title', formData.title);
    if (formData.content) payload.append('content', formData.content);
    if (formData.subTitle !== undefined) payload.append('subTitle', formData.subTitle);

    if (formData.bannerImage) {
      payload.append('bannerImage', formData.bannerImage);
    }

    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      payload.append('tags', JSON.stringify(tagsArray));
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/magazine/updateArticle/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.msg || 'Article updated successfully!');
      // console.log(response);
      
      // Navigate back after a short delay
      if(response.status === 200){
        navigate(`/article/${id}`)
      }

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error updating article');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadArea = ({ preview }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Image className="inline w-4 h-4 mr-2 text-pink-500" />
        Banner Image
      </label>

      {!preview ? (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-200">
            <Upload className="mx-auto h-12 w-12 text-pink-400 mb-4" />
            <p className="text-pink-600 font-medium">Click to upload banner image</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border-2 border-pink-200">
            <img
              src={preview}
              alt="Banner Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={removeFile}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!originalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Article not found</p>
          <button
            onClick={() => navigate('/admin/articles')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 mx-auto">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              Edit Article
            </h1>
          </div>
        </div>

        {/* Author Info (Read-only) */}
        {originalData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Author Information (Read-only)</h3>
            <div className="flex items-center gap-4">
              {originalData.authorProfilePic && (
                <img
                  src={originalData.authorProfilePic}
                  alt="Author"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
                />
              )}
              <div>
                <p className="font-medium text-gray-800">{originalData.authorName}</p>
                <p className="text-sm text-gray-500">Author details cannot be modified</p>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.includes('Error')
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Edit Article Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Article Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-2 text-pink-500" />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. fashion, beauty, lifestyle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-2 text-pink-500" />
                  Tags (Hashtags)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="#fashion, #style, #trends (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter an engaging title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subTitle"
                  placeholder="Add a subtitle to provide more context"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={formData.subTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Banner Image */}
            <FileUploadArea preview={bannerPreview} />

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                Article Content *
              </label>
              <textarea
                name="content"
                placeholder="Write your article content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 min-h-64 resize-y"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;