import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { Search, Filter, Plus, RefreshCw, AlertCircle } from 'lucide-react';
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
            a
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-1">Article Management</h1>
                        <p className="text-gray-600">Manage and organize your published articles</p>
                    </div>
                    <button
                        onClick={() => navigate('/articles/create')}
                        className="bg-gradient-to-r from-rose-400 via-pink-300 to-fuchsia-400 text-white px-7 py-3 rounded-full flex items-center gap-2 font-medium tracking-wide shadow-md hover:shadow-lg hover:from-rose-500 hover:to-fuchsia-500 transition-all duration-300"
                    >
                        <Plus size={18} className="text-white" />
                        Add More
                    </button>

                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative w-full sm:w-2/3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, content, or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative w-full sm:w-1/3">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="capitalize">
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mb-8 text-sm text-gray-600">
                    <span className="bg-white px-4 py-2 rounded-full shadow">Total: {articles.length}</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Showing: {filteredArticles.length}</span>
                    {selectedCategory !== 'all' && (
                        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full capitalize">
                            Category: {selectedCategory}
                        </span>
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
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-purple-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Articles Found</h2>
                        {(searchTerm || selectedCategory !== 'all') ? (
                            <>
                                <p className="text-gray-500 mb-4">No articles match your filters.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="text-purple-600 font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-500">Start by creating your first article.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlePage;