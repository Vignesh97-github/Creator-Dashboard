import Post from '../models/Post.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import redditService from '../services/redditService.js';
import twitterService from '../services/twitterService.js';

export const getFeed = async (req, res) => {
  try {
    // Fetch from APIs
    const twitterPosts = await twitterService.fetchTwitterPosts();
    const redditPosts = await redditService.fetchRedditPosts();
    
    // Combine and sort by date
    const allPosts = [...twitterPosts, ...redditPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Check if posts exist in DB, if not save them
    for (const post of allPosts) {
      const exists = await Post.findOne({ sourceId: post.sourceId, source: post.source });
      if (!exists) {
        await Post.create(post);
      }
    }
    
    // Get posts from DB (to include any user-specific data like saved status)
    const dbPosts = await Post.find({
      _id: { $in: allPosts.map(p => p._id) },
      reportedBy: { $nin: [req.user._id] } // Exclude posts reported by this user
    }).sort({ timestamp: -1 });
    
    res.json(dbPosts);
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.savedPosts.includes(postId)) {
      user.savedPosts.push(postId);
      await user.save();
    }
    
    res.json({ message: 'Post saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    
    if (!post.reportedBy.includes(req.user._id)) {
      post.reportedBy.push(req.user._id);
      await post.save();
    }
    
    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // In a real app, you would implement actual sharing functionality here
    res.json({ 
      message: 'Post shared successfully', 
      url: post.url 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};