import React, { useState, useEffect } from 'react';
import { Camera, FileText, Tag, User, Image, Upload, X } from 'lucide-react';
import axios from 'axios';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    authorProfilePic: null,
    authorName: '',
    category: '',
    title: '',
    content: '',
    subTitle: '',
    bannerImage: null,
    tags: '',
  });

  const [previews, setPreviews] = useState({
    authorProfilePic: null,
    bannerImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Error: File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Error: Please select a valid image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.onerror = () => {
        setMessage('Error: Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
    }));
    setPreviews(prev => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const validateForm = () => {
    if (!formData.authorName.trim()) {
      setMessage('Error: Author name is required');
      return false;
    }
    if (!formData.category.trim()) {
      setMessage('Error: Category is required');
      return false;
    }
    if (!formData.title.trim()) {
      setMessage('Error: Article title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setMessage('Error: Article content is required');
      return false;
    }
    if (!formData.bannerImage) {
      setMessage('Error: Banner image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    const payload = new FormData();
    payload.append('authorName', formData.authorName.trim());
    payload.append('category', formData.category.trim());
    payload.append('title', formData.title.trim());
    payload.append('content', formData.content.trim());
    payload.append('subTitle', formData.subTitle.trim() || formData.title.trim());

    if (formData.authorProfilePic) {
      payload.append('authorProfilePic', formData.authorProfilePic);
    }
    if (formData.bannerImage) {
      payload.append('bannerImage', formData.bannerImage);
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    payload.append('tags', JSON.stringify(tagsArray));

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/magazine/addArticle`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.msg || 'Article created successfully!');

      // Reset form
      setFormData({
        authorProfilePic: null,
        authorName: '',
        category: '',
        title: '',
        content: '',
        subTitle: '',
        bannerImage: null,
        tags: '',
      });
      setPreviews({
        authorProfilePic: null,
        bannerImage: null,
      });

    } catch (err) {
      console.error('Submission error:', err);
      setMessage('Error: Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear message after 5 seconds
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const FileUploadArea = ({ fieldName, label, icon: Icon, preview, accept = "image/*" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <Icon className="inline w-4 h-4 mr-2 text-pink-500" />
        {label}
      </label>

      {!preview ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e, fieldName)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-200">
            <Upload className="mx-auto h-8 w-8 text-pink-400 mb-2" />
            <p className="text-pink-600 font-medium text-sm">Upload {label.toLowerCase()}</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative border-2 border-pink-200 rounded-lg overflow-hidden bg-gray-50">
            <div className="w-full h-32 flex items-center justify-center p-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-cover rounded-md"
                onError={(e) => {
                  console.error('Image preview failed to load');
                  setMessage('Error: Image preview failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => removeFile(fieldName)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Create Article
          </h1>
          <p className="text-gray-600 text-sm">Share your thoughts and inspire others</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-medium text-sm ${message.includes('Error')
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
            {message}
          </div>
        )}

        {/* Compact Form */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100">
          <div className="p-6 space-y-6">

            {/* Author Section - Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2 text-pink-500" />
                  Author Name *
                </label>
                <input
                  type="text"
                  name="authorName"
                  placeholder="Enter author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FileUploadArea
                fieldName="authorProfilePic"
                label="Profile Picture"
                icon={Camera}
                preview={previews.authorProfilePic}
              />
            </div>

            {/* Category and Tags - Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-2 text-pink-500" />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. fashion, beauty, lifestyle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-2 text-pink-500" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="#fashion, #style, #trends"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Titles - Vertical but compact */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter an engaging title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  placeholder="Add a subtitle (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={formData.subTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Content and Banner Image - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content - Takes up 2/3 */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                  Article Content *
                </label>
                <textarea
                  name="content"
                  placeholder="Write your article content here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-48 resize-y"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Banner Image - Takes up 1/3 */}
              <div className="lg:col-span-1">
                <FileUploadArea
                  fieldName="bannerImage"
                  label="Banner Image *"
                  icon={Image}
                  preview={previews.bannerImage}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be the main image for your article
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </div>
                ) : (
                  'Publish Article'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;