import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  source: { type: String, enum: ['twitter', 'reddit', 'manual'], required: true },
  sourceId: { type: String },
  content: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  media: { type: String },
  timestamp: { type: Date, required: true },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  metadata: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    subreddit: String
  },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post; 