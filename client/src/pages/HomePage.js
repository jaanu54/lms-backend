import React from 'react';
import { BookOpenIcon, AcademicCapIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Learning Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Login</button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Learn Smarter with{' '}
              <span className="text-primary-600">AI-Powered</span>{' '}
              Education
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Personalized learning paths, AI teaching assistants, and interactive courses
              designed to help you master any subject.
            </p>
            <div className="space-x-4">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-primary-700">
                Get Started
              </button>
              <button className="bg-white text-gray-700 px-8 py-3 rounded-lg text-lg border border-gray-300 hover:bg-gray-50">
                View Courses
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpenIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Courses</h3>
              <p className="text-gray-600">
                Learn with hands-on exercises, quizzes, and real-world projects.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <AcademicCapIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Teaching Assistant</h3>
              <p className="text-gray-600">
                Get instant answers and explanations from our AI assistant.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;