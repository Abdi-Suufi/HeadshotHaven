const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['aim', 'cps', 'reaction'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  // Additional game-specific data
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // For aim game: accuracy, targets hit, time taken
  // For CPS game: clicks, time duration
  // For reaction game: reaction time, attempts
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient leaderboard queries
gameScoreSchema.index({ gameType: 1, score: -1, createdAt: -1 });
gameScoreSchema.index({ userId: 1, gameType: 1 });

module.exports = mongoose.model('GameScore', gameScoreSchema); 