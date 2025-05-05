const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Activity = require('../models/Activity.js');
const redditService = require('../services/redditService.js');
const twitterService = require('../services/twitterService.js');

const getFeed = async (req, res) => {
  try {
    // Fetch from APIs
    const twitterPosts = await twitterService();
    const redditPosts = await redditService();
    
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
      reportedBy: { $nin: [req.userId] } // Exclude posts reported by this user
    }).sort({ timestamp: -1 });
    
    res.json(dbPosts);
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

const savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user.savedPosts.includes(postId)) {
      user.savedPosts.push(postId);
      await user.save();
    }
    
    res.json({ message: 'Post saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const reportPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    
    if (!post.reportedBy.includes(req.userId)) {
      post.reportedBy.push(req.userId);
      await post.save();
    }
    
    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sharePost = async (req, res) => {
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

module.exports = { getFeed, savePost, reportPost, sharePost };