import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4 text-center">
      {/* Illustration */}
      <img
        src="https://undraw.co/api/illustrations/8b73e01d-4861-49ae-87fd-4bb282ae6b80"
        alt="Error Illustration"
        className="w-64 mb-8"
      />

      {/* Message */}
      <h1 className="text-4xl font-bold text-pink-600 mb-2">Oops! Something went wrong.</h1>
      <p className="text-gray-700 text-lg mb-6">
        We couldn't find the page you were looking for, or an unexpected error occurred.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;