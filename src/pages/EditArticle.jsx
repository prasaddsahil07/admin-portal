import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Tag, Image, Upload, X, Save, User, Camera } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

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
  const [editorRef, setEditorRef] = useState(null);

  // Fetch article data on component mount
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setFetchLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/magazine/article/${id}`
        );

        const article = response.data;
        setOriginalData(article.data);

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
        setMessage('Error: Failed to load article. Please try again.');
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

  // Handle rich text editor content change
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content,
    }));
  };

  const handleFileChange = (e) => {
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
        bannerImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.onerror = () => {
        setMessage('Error: Failed to read file');
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

  // Custom image upload handler for TinyMCE
  const handleImageUpload = async (blobInfo, progress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/magazine/uploadContentImage`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              progress(percentCompleted);
            },
          }
        );

        resolve(response.data.imageUrl || response.data.url);
      } catch (error) {
        console.error('Image upload failed:', error);
        reject('Image upload failed: ' + (error.response?.data?.message || error.message));
      }
    });
  };

  const validateForm = () => {
    if (!formData.category.trim()) {
      setMessage('Error: Category is required');
      return false;
    }
    if (!formData.title.trim()) {
      setMessage('Error: Article title is required');
      return false;
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      setMessage('Error: Article content is required');
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

    // Only append fields that have values
    if (formData.category) payload.append('category', formData.category.trim());
    if (formData.title) payload.append('title', formData.title.trim());
    if (formData.content) payload.append('content', formData.content);
    if (formData.subTitle !== undefined) payload.append('subTitle', formData.subTitle.trim());

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

      // Navigate back after a short delay
      if (response.status === 200) {
        setTimeout(() => {
          navigate(`/article/${id}`);
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      setMessage('Error: Failed to update article. Please try again.');
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
          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-400 hover:bg-pink-50 transition-all duration-200">
            <Upload className="mx-auto h-8 w-8 text-pink-400 mb-2" />
            <p className="text-pink-600 font-medium text-sm">Upload banner image</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative border-2 border-pink-200 rounded-lg overflow-hidden bg-gray-50">
            <div className="w-full h-32 flex items-center justify-center p-2">
              <img
                src={preview}
                alt="Banner Preview"
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
              onClick={removeFile}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        This will be the main image for your article preview
      </p>
    </div>
  );

  useEffect(() => {
    if (message) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear success message after 5 seconds
      if (!message.includes('Error')) {
        const timer = setTimeout(() => setMessage(''), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [message]);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Edit Article
          </h1>
          <p className="text-gray-600 text-sm">Update your article content and details</p>
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

        {/* Author Info (Read-only) */}
        {originalData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Author Information (Read-only)</h3>
            <div className="flex items-center gap-3">
              {originalData.authorProfilePic && (
                <img
                  src={originalData.authorProfilePic}
                  alt="Author"
                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
                />
              )}
              <div>
                <p className="font-medium text-gray-800 text-sm">{originalData.authorName}</p>
                <p className="text-xs text-gray-500">Author details cannot be modified</p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Form */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100">
          <div className="p-6 space-y-6">

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

            {/* Rich Text Editor and Banner Image */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Rich Text Editor - Takes up 3/4 */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-pink-500" />
                  Article Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Editor
                    apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
                    onInit={(evt, editor) => setEditorRef(editor)}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
                        'textcolor', 'colorpicker', 'fontsize'
                      ],
                      toolbar: 'undo redo | blocks fontsize | ' +
                        'bold italic forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image media link | emoticons | help',
                      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 14px; line-height: 1.6; }',

                      // Image upload configuration
                      images_upload_handler: handleImageUpload,
                      automatic_uploads: true,
                      images_upload_base_path: '/images/',
                      paste_data_images: true,

                      fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 72pt',

                      // Additional formatting options
                      block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;',

                      // Link configuration
                      link_default_target: '_blank',
                      link_assume_external_targets: true,

                      // Table configuration
                      table_default_attributes: {
                        border: '1'
                      },
                      table_default_styles: {
                        'border-collapse': 'collapse',
                        'width': '100%'
                      },

                      color_map: [
                        "000000", "Black",
                        "993300", "Burnt orange",
                        "333300", "Dark olive",
                        "003300", "Dark green",
                        "003366", "Dark azure",
                        "000080", "Navy Blue",
                        "333399", "Indigo",
                        "333333", "Very dark gray",
                        "800000", "Maroon",
                        "FF6600", "Orange",
                        "808000", "Olive",
                        "008000", "Green",
                        "008080", "Teal",
                        "0000FF", "Blue",
                        "666699", "Grayish blue",
                        "808080", "Gray"
                      ],

                      // Responsive image handling
                      image_advtab: true,
                      image_caption: true,
                      image_title: true,

                      // Content filtering
                      valid_elements: '*[*]',
                      extended_valid_elements: 'script[src|async|defer|type|charset]',

                      // Skin and theme
                      skin: 'oxide',
                      content_css: 'default',

                      // Mobile responsive
                      mobile: {
                        menubar: false,
                        toolbar: 'undo redo | bold italic | bullist numlist | image link'
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the toolbar above to format your text, add images, and create rich content
                </p>
              </div>

              {/* Banner Image - Takes up 1/4 */}
              <div className="lg:col-span-1">
                <FileUploadArea preview={bannerPreview} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Update Article
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;