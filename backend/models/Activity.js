import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['post', 'like', 'share', 'comment', 'credit'] },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  credits: { type: Number, default: 0 },
  description: String
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity; 