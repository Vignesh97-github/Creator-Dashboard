const User = require('../models/User.js');
const Activity = require('../models/Activity.js');

const awardCredits = async (req, res, next) => {
  if (!req.userId) return next();
  
  try {
    const user = await User.findById(req.userId);
    let creditsAwarded = 0;
    let action = '';
    
    // Daily login bonus
    if (req.path === '/api/auth/login' && 
        (!user.lastLogin || new Date(user.lastLogin).toDateString() !== new Date().toDateString())) {
      creditsAwarded = 10;
      action = 'daily_login';
      user.lastLogin = new Date();
    }
    
    // Profile completion bonus
    if (req.path === '/api/users/profile' && req.method === 'PUT' && !user.profileCompleted) {
      creditsAwarded = 50;
      action = 'profile_completion';
      user.profileCompleted = true;
    }
    
    // Feed interaction bonuses
    if (req.path.includes('/api/feed') && req.method === 'POST') {
      if (req.path.includes('/save')) {
        creditsAwarded = 5;
        action = 'save_post';
      } else if (req.path.includes('/share')) {
        creditsAwarded = 3;
        action = 'share_post';
      }
    }
    
    if (creditsAwarded > 0) {
      user.credits += creditsAwarded;
      await user.save();
      
      await Activity.create({
        user: user._id,
        action,
        creditsEarned: creditsAwarded,
        post: req.body.postId
      });
    }
    
    next();
  } catch (err) {
    console.error('Credit awarding error:', err);
    next();
  }
};

module.exports = awardCredits; 