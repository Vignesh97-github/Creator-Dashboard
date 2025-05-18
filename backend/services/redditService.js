import axios from 'axios';
import Post from '../models/Post.js';

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

const getRedditPosts = async (subreddit) => {
  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json`, {
      headers: {
        'User-Agent': 'CreatorDashboard/1.0.0'
      }
    });
    return response.data.data.children;
  } catch (error) {
    console.error('Reddit API Error:', error);
    throw error;
  }
};

const saveRedditPosts = async (posts, userId) => {
  try {
    const formattedPosts = posts.map(post => ({
      content: post.data.title,
      source: 'reddit',
      sourceId: post.data.id,
      user: userId,
      metadata: {
        upvotes: post.data.ups,
        downvotes: post.data.downs,
        comments: post.data.num_comments,
        subreddit: post.data.subreddit
      }
    }));

    await Post.insertMany(formattedPosts);
    return formattedPosts;
  } catch (error) {
    console.error('Save Reddit Posts Error:', error);
    throw error;
  }
};

export default {
  fetchRedditPosts,
  getRedditPosts,
  saveRedditPosts
};