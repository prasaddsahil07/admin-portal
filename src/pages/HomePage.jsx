import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mt-10 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
          Empowering Women Through Information
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          A space dedicated to sharing knowledge, safety tips, and stories through curated articles for and by women.
        </p>

        {/* Vector Illustration */}
        <div className="mt-10 flex justify-center h-60">
          <img
            src="undraw_book-lover_f1dq.png" // replace with your preferred women-centric vector
            alt="Empowered Women Illustration"
            className="w-full max-w-md"
          />
        </div>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/articles/create"
            className="px-6 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
          >
            Add New Article
          </Link>
          <Link
            to="/articles"
            className="px-6 py-3 bg-white border border-pink-600 text-pink-600 rounded-full hover:bg-pink-100 transition"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;