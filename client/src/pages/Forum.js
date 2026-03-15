import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  PlusIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid';

const Forum = () => {
  const { courseId } = useParams();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    // Mock data - replace with API call
    setDiscussions([
      {
        id: 1,
        title: 'Question about React Hooks',
        author: 'John Doe',
        date: '2024-03-15',
        content: 'Can someone explain how useEffect works?',
        likes: 5,
        comments: [
          { id: 1, author: 'Jane Smith', content: 'useEffect runs after every render...', likes: 3 }
        ]
      },
      {
        id: 2,
        title: 'MongoDB Aggregation Pipeline',
        author: 'Alice Johnson',
        date: '2024-03-14',
        content: 'Looking for resources on aggregation pipeline',
        likes: 3,
        comments: []
      }
    ]);
    setLoading(false);
  };

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    const newDiscussionItem = {
      id: discussions.length + 1,
      title: newDiscussion.title,
      author: 'Current User',
      date: new Date().toISOString().split('T')[0],
      content: newDiscussion.content,
      likes: 0,
      comments: []
    };
    setDiscussions([newDiscussionItem, ...discussions]);
    setShowNewDiscussion(false);
    setNewDiscussion({ title: '', content: '' });
  };

  const handleAddComment = (discussionId) => {
    if (!newComment.trim()) return;

    const updatedDiscussions = discussions.map(disc => {
      if (disc.id === discussionId) {
        return {
          ...disc,
          comments: [
            ...disc.comments,
            {
              id: disc.comments.length + 1,
              author: 'Current User',
              content: newComment,
              likes: 0
            }
          ]
        };
      }
      return disc;
    });

    setDiscussions(updatedDiscussions);
    setNewComment('');
  };

  const handleLike = (discussionId) => {
    const updatedDiscussions = discussions.map(disc => {
      if (disc.id === discussionId) {
        return { ...disc, likes: disc.likes + 1 };
      }
      return disc;
    });
    setDiscussions(updatedDiscussions);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
            <p className="text-gray-600 mt-1">Ask questions and share knowledge</p>
          </div>
          <button
            onClick={() => setShowNewDiscussion(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Discussion</span>
          </button>
        </div>

        {/* New Discussion Form */}
        {showNewDiscussion && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Start a New Discussion</h2>
            <form onSubmit={handleCreateDiscussion}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewDiscussion(false)}
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Discussion Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{discussion.title}</h3>
                  <button
                    onClick={() => handleLike(discussion.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
                  >
                    {discussion.likes > 0 ? (
                      <HandThumbUpSolid className="h-5 w-5 text-primary-600" />
                    ) : (
                      <HandThumbUpIcon className="h-5 w-5" />
                    )}
                    <span>{discussion.likes}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <span>{discussion.author}</span>
                  <span>•</span>
                  <span>{discussion.date}</span>
                </div>
                
                <p className="text-gray-700 mb-4">{discussion.content}</p>

                {/* Comments Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setSelectedDiscussion(
                      selectedDiscussion === discussion.id ? null : discussion.id
                    )}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 mb-4"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span>{discussion.comments.length} comments</span>
                  </button>

                  {selectedDiscussion === discussion.id && (
                    <div className="space-y-4">
                      {/* Existing Comments */}
                      {discussion.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3 ml-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex space-x-2 mt-4">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={() => handleAddComment(discussion.id)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;