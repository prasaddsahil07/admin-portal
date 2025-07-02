import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { Search, Filter, Plus, RefreshCw, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArticlePage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/magazine/allArticles`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.msg || 'Failed to fetch articles');

            setArticles(data.data || []);

            const uniqueCategories = [...new Set(data.data.map(article => article.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDeleteArticle = async (articleId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/magazine/deleteArticle/${articleId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to delete');

            setArticles(prev => prev.filter(article => article._id !== articleId));
            alert('Article deleted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to delete article.');
        }
    };

    const handleUpdateArticle = (id) => {
        navigate(`/articles/edit/${id}`);
    };

    const handleViewArticle = (id) => {
        navigate(`/article/${id}`);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // UI
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin h-14 w-14 border-4 border-purple-300 border-t-purple-600 rounded-full mx-auto mb-4" />
                    <p className="text-purple-600 font-medium">Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Error loading articles</h2>
                    <p className="text-gray-500 mt-2 mb-6">{error}</p>
                    <button
                        onClick={fetchArticles}
                        className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-1">Article Management</h1>
                        <p className="text-gray-600">Manage and organize your published articles</p>
                    </div>
                    <button
                        onClick={() => navigate('/articles/create')}
                        className="bg-gradient-to-r from-rose-400 via-pink-300 to-fuchsia-400 text-white px-7 py-3 rounded-full flex items-center gap-2 font-medium tracking-wide shadow-md hover:shadow-lg hover:from-rose-500 hover:to-fuchsia-500 transition-all duration-300"
                    >
                        <Plus size={18} className="text-white" />
                        <h5 className="text-white">Add More</h5>
                    </button>
                </div>

                {/* Enhanced Search + Filter Section */}
                <div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Enhanced Search Bar */}
                        <div className="flex-1">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 hover:border-pink-200 transition-all duration-300">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-pink-500 transition-colors duration-300" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by title, content, or author..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-transparent border-0 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-gray-700 placeholder-gray-400 font-medium"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Category Filter */}
                        <div className="sm:w-80">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 hover:border-purple-200 transition-all duration-300">
                                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" size={20} />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-transparent border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 font-medium cursor-pointer appearance-none"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="capitalize py-2">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Custom dropdown arrow */}
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchTerm || selectedCategory !== 'all') && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                                {searchTerm && (
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                                        <Search size={14} />
                                        <span>"{searchTerm}"</span>
                                        <button
                                            onClick={clearSearch}
                                            className="ml-1 hover:text-pink-900 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {selectedCategory !== 'all' && (
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium capitalize">
                                        <Filter size={14} />
                                        <span>{selectedCategory}</span>
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className="ml-1 hover:text-purple-900 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-gray-700 font-medium underline transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Stats */}
                <div className="flex flex-wrap gap-4 mb-8 pt-6">
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/50 flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Total: <span className="font-bold text-gray-800">{articles.length}</span></span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-white/50 flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Showing: <span className="font-bold text-gray-800">{filteredArticles.length}</span></span>
                    </div>
                    {selectedCategory !== 'all' && (
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-6 py-3 rounded-2xl shadow-md border border-purple-200 flex items-center gap-3">
                            <Filter size={16} />
                            <span className="font-medium capitalize">Category: {selectedCategory}</span>
                        </div>
                    )}
                </div>

                {/* Articles List */}
                {filteredArticles.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredArticles.map((article) => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onUpdate={handleUpdateArticle}
                                onDelete={handleDeleteArticle}
                                onClick={handleViewArticle}
                                showAdminActions={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto flex items-center justify-center mb-8 shadow-lg">
                            <Search className="w-16 h-16 text-purple-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-3">No Articles Found</h2>
                        {(searchTerm || selectedCategory !== 'all') ? (
                            <>
                                <p className="text-gray-500 mb-6 text-lg">No articles match your current filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Clear All Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-500 mb-6 text-lg">Start by creating your first article.</p>
                                <button
                                    onClick={() => navigate('/articles/create')}
                                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                                >
                                    <Plus size={18} />
                                    Create First Article
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlePage;