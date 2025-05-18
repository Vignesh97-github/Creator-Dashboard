import axios from 'axios';
import Post from '../models/Post.js';

// Note: In a real app, you would use the Twitter API with proper authentication
const fetchTwitterPosts = async () => {
  try {
    // Mock data - replace with actual Twitter API calls
    const mockPosts = [
      {
        source: 'twitter',
        sourceId: `twitter_${Date.now()}_1`,
        content: 'Just launched our new Creator Dashboard! Check it out #creatortools',
        author: 'TechNews',
        url: 'https://twitter.com/TechNews/status/123',
        timestamp: new Date(),
      },
      {
        source: 'twitter',
        sourceId: `twitter_${Date.now()}_2`,
        content: 'How to grow your audience as a content creator - thread below 👇',
        author: 'CreatorGuru',
        url: 'https://twitter.com/CreatorGuru/status/456',
        timestamp: new Date(Date.now() - 3600000),
      }
    ];
    
    return mockPosts;
  } catch (error) {
    console.error('Twitter API error:', error);
    return [];
  }
};

const getTweets = async (username) => {
    try {
        const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}/tweets`, {
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Twitter API Error:', error);
        throw error;
    }
};

const saveTweets = async (tweets, userId) => {
    try {
        const posts = tweets.map(tweet => ({
            content: tweet.text,
            source: 'twitter',
            sourceId: tweet.id,
            user: userId,
            metadata: {
                likes: tweet.public_metrics.like_count,
                retweets: tweet.public_metrics.retweet_count,
                replies: tweet.public_metrics.reply_count
            }
        }));

        await Post.insertMany(posts);
        return posts;
    } catch (error) {
        console.error('Save Tweets Error:', error);
        throw error;
    }
};

export default {
    fetchTwitterPosts,
    getTweets,
    saveTweets
};