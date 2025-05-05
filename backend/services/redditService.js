const axios = require('axios');
const Post = require('../models/Post');

const fetchRedditPosts = async () => {
  try {
    // Mock data - replace with actual Reddit API calls
    const mockPosts = [
      {
        source: 'reddit',
        sourceId: `reddit_${Date.now()}_1`,
        content: 'What tools do you use as a content creator? Looking for recommendations.',
        author: 'u/contentcreator123',
        url: 'https://reddit.com/r/contentcreation/comments/abc123',
        timestamp: new Date(),
      },
      {
        source: 'reddit',
        sourceId: `reddit_${Date.now()}_2`,
        content: 'Just hit 10k followers! Here are the strategies that worked for me...',
        author: 'u/successfulcreator',
        url: 'https://reddit.com/r/socialmedia/comments/def456',
        timestamp: new Date(Date.now() - 7200000),
      }
    ];
    
    return mockPosts;
  } catch (error) {
    console.error('Reddit API error:', error);
    return [];
  }
};

module.exports = { fetchRedditPosts };