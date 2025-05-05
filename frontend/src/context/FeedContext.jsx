import React, { createContext, useContext, useState, useEffect } from 'react';
import { feedService } from '../services/api';

const FeedContext = createContext(null);

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setError(null);
      const data = await feedService.getPosts(page);
      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content, image) => {
    try {
      setError(null);
      const newPost = await feedService.createPost(content, image);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err.message || 'Failed to create post');
      throw err;
    }
  };

  const updatePost = async (postId, content, image) => {
    try {
      setError(null);
      const updatedPost = await feedService.updatePost(postId, content, image);
      setPosts(prev =>
        prev.map(post => (post.id === postId ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(err.message || 'Failed to update post');
      throw err;
    }
  };

  const deletePost = async (postId) => {
    try {
      setError(null);
      await feedService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    }
  };

  const likePost = async (postId) => {
    try {
      setError(null);
      const updatedPost = await feedService.likePost(postId);
      setPosts(prev =>
        prev.map(post => (post.id === postId ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(err.message || 'Failed to like post');
      throw err;
    }
  };

  const addComment = async (postId, content) => {
    try {
      setError(null);
      const updatedPost = await feedService.addComment(postId, content);
      setPosts(prev =>
        prev.map(post => (post.id === postId ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      throw err;
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      setError(null);
      const updatedPost = await feedService.deleteComment(postId, commentId);
      setPosts(prev =>
        prev.map(post => (post.id === postId ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      throw err;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refreshPosts = () => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts();
  };

  const value = {
    posts,
    loading,
    error,
    hasMore,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    loadMore,
    refreshPosts
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

export default FeedContext; 