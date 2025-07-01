import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CreateArticle from './pages/CreateArticle';
import ErrorPage from './pages/ErrorPage';
import Navbar from './components/Navbar'; // Optional: Only if already created
import EditArticle from './pages/EditArticle';
import ArticlePage from './pages/ArticlesPage';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      {/* Optional Navbar (if you have it) */}
      <Navbar />

      {/* Define all routes here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route path="/articles" element={<ArticlePage />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/articles/edit/:id" element={<EditArticle />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;