import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, FileText, Tag, User, ImageIcon, Upload, X } from 'lucide-react';

const CreateArticle = () => {
  const navigate = useNavigate();
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
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [fieldName]: e.target.result,
        }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('authorName', formData.authorName);
    payload.append('category', formData.category);
    payload.append('title', formData.title);
    payload.append('content', formData.content);
    payload.append('subTitle', formData.subTitle || formData.title);

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
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/magazine/addArticle`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data?.msg || 'Article created successfully!');

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
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error creating article');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadArea = ({ fieldName, label, icon: Icon, preview, accept = "image/*" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-200">
            <Upload className="mx-auto h-12 w-12 text-pink-400 mb-4" />
            <p className="text-pink-600 font-medium">Click to upload {label.toLowerCase()}</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border-2 border-pink-200">
            <img
              src={preview}
              alt="Preview"
              className={`w-full object-cover ${fieldName === 'authorProfilePic' ? 'h-32' : 'h-48'}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeFile(fieldName)}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Create New Article
          </h1>
          <p className="text-gray-600">Share your thoughts and inspire others</p>
        </div>

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
            <h2 className="text-xl font-semibold text-white">Article Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Author Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2 text-pink-500" />
                  Author Name *
                </label>
                <input
                  type="text"
                  name="authorName"
                  placeholder="Enter author name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FileUploadArea
                fieldName="authorProfilePic"
                label="Author Profile Picture"
                icon={Camera}
                preview={previews.authorProfilePic}
              />
            </div>

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
                  Subtitle (Optional)
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
            <FileUploadArea
              fieldName="bannerImage"
              label="Banner Image *"
              icon={ImageIcon}
              preview={previews.bannerImage}
            />

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

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </div>
                ) : (
                  'Publish Article'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;