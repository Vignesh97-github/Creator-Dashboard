const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  source: { type: String, enum: ['twitter', 'reddit', 'linkedin'], required: true },
  sourceId: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  media: { type: String },
  timestamp: { type: Date, required: true },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema); 