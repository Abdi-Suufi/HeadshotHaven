const express = require('express');
const User = require('../models/User');
const GameScore = require('../models/GameScore');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Submit aim training score
router.post('/aim', authenticateToken, async (req, res) => {
  try {
    const { score, gameData } = req.body;
    const userId = req.user._id;

    // Create game score record
    const gameScore = new GameScore({
      userId,
      username: req.user.username,
      gameType: 'aim',
      score,
      gameData
    });

    await gameScore.save();

    // Update user's best score if this is higher
    if (score > req.user.aimScore) {
      req.user.aimScore = score;
      await req.user.save();
    }

    res.status(201).json({
      message: 'Aim score submitted successfully',
      score: gameScore,
      userBest: req.user.aimScore
    });
  } catch (error) {
    console.error('Aim score submission error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Submit CPS score
router.post('/cps', authenticateToken, async (req, res) => {
  try {
    const { score, gameData } = req.body;
    const userId = req.user._id;

    const gameScore = new GameScore({
      userId,
      username: req.user.username,
      gameType: 'cps',
      score,
      gameData
    });

    await gameScore.save();

    if (score > req.user.cpsScore) {
      req.user.cpsScore = score;
      await req.user.save();
    }

    res.status(201).json({
      message: 'CPS score submitted successfully',
      score: gameScore,
      userBest: req.user.cpsScore
    });
  } catch (error) {
    console.error('CPS score submission error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Submit reaction speed score
router.post('/reaction', authenticateToken, async (req, res) => {
  try {
    const { score, gameData } = req.body;
    const userId = req.user._id;

    const gameScore = new GameScore({
      userId,
      username: req.user.username,
      gameType: 'reaction',
      score,
      gameData
    });

    await gameScore.save();

    if (score > req.user.reactionScore) {
      req.user.reactionScore = score;
      await req.user.save();
    }

    res.status(201).json({
      message: 'Reaction score submitted successfully',
      score: gameScore,
      userBest: req.user.reactionScore
    });
  } catch (error) {
    console.error('Reaction score submission error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get aim training leaderboard
router.get('/aim/leaderboard', optionalAuth, async (req, res) => {
  try {
    const leaderboard = await GameScore.find({ gameType: 'aim' })
      .sort({ score: -1, createdAt: -1 })
      .limit(10)
      .populate('userId', 'username profilePicture');

    const formattedLeaderboard = leaderboard.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      score: score.score,
      profilePicture: score.userId.profilePicture,
      createdAt: score.createdAt
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Aim leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get CPS leaderboard
router.get('/cps/leaderboard', optionalAuth, async (req, res) => {
  try {
    const leaderboard = await GameScore.find({ gameType: 'cps' })
      .sort({ score: -1, createdAt: -1 })
      .limit(10)
      .populate('userId', 'username profilePicture');

    const formattedLeaderboard = leaderboard.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      score: score.score,
      profilePicture: score.userId.profilePicture,
      createdAt: score.createdAt
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('CPS leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get reaction speed leaderboard
router.get('/reaction/leaderboard', optionalAuth, async (req, res) => {
  try {
    const leaderboard = await GameScore.find({ gameType: 'reaction' })
      .sort({ score: -1, createdAt: -1 })
      .limit(10)
      .populate('userId', 'username profilePicture');

    const formattedLeaderboard = leaderboard.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      score: score.score,
      profilePicture: score.userId.profilePicture,
      createdAt: score.createdAt
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Reaction leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's game history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { gameType, limit = 10 } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (gameType) {
      query.gameType = gameType;
    }

    const history = await GameScore.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ history });
  } catch (error) {
    console.error('Game history error:', error);
    res.status(500).json({ error: 'Failed to fetch game history' });
  }
});

// Reset user's scores (admin only or user's own scores)
router.delete('/reset-scores', authenticateToken, async (req, res) => {
  try {
    const { gameType } = req.body;
    const userId = req.user._id;

    // Reset user's best scores
    const updateData = {};
    if (gameType === 'aim' || !gameType) updateData.aimScore = 0;
    if (gameType === 'cps' || !gameType) updateData.cpsScore = 0;
    if (gameType === 'reaction' || !gameType) updateData.reactionScore = 0;

    await User.findByIdAndUpdate(userId, updateData);

    // Delete game score records
    const deleteQuery = { userId };
    if (gameType) deleteQuery.gameType = gameType;

    await GameScore.deleteMany(deleteQuery);

    res.json({ message: 'Scores reset successfully' });
  } catch (error) {
    console.error('Reset scores error:', error);
    res.status(500).json({ error: 'Failed to reset scores' });
  }
});

module.exports = router; 