const express = require('express');
const User = require('../models/User');
const GameScore = require('../models/GameScore');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (admin)
router.put('/users/:userId', async (req, res) => {
  try {
    const { username, email, isAdmin, aimScore, cpsScore, reactionScore } = req.body;
    
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (aimScore !== undefined) updateData.aimScore = aimScore;
    if (cpsScore !== undefined) updateData.cpsScore = cpsScore;
    if (reactionScore !== undefined) updateData.reactionScore = reactionScore;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin)
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete all game scores for this user
    await GameScore.deleteMany({ userId: req.params.userId });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Reset user scores (admin)
router.post('/users/:userId/reset-scores', async (req, res) => {
  try {
    const { gameType } = req.body;
    const userId = req.params.userId;

    const updateData = {};
    if (gameType === 'aim' || !gameType) updateData.aimScore = 0;
    if (gameType === 'cps' || !gameType) updateData.cpsScore = 0;
    if (gameType === 'reaction' || !gameType) updateData.reactionScore = 0;

    await User.findByIdAndUpdate(userId, updateData);

    // Delete game score records
    const deleteQuery = { userId };
    if (gameType) deleteQuery.gameType = gameType;

    await GameScore.deleteMany(deleteQuery);

    res.json({ message: 'User scores reset successfully' });
  } catch (error) {
    console.error('Reset user scores error:', error);
    res.status(500).json({ error: 'Failed to reset user scores' });
  }
});

// Get all game scores
router.get('/scores', async (req, res) => {
  try {
    const { page = 1, limit = 10, gameType, userId } = req.query;
    
    const query = {};
    if (gameType) query.gameType = gameType;
    if (userId) query.userId = userId;

    const scores = await GameScore.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameScore.countDocuments(query);

    res.json({
      scores,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Delete game score (admin)
router.delete('/scores/:scoreId', async (req, res) => {
  try {
    const score = await GameScore.findByIdAndDelete(req.params.scoreId);
    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Delete score error:', error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScores = await GameScore.countDocuments();
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');

    const recentScores = await GameScore.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      totalUsers,
      totalScores,
      recentUsers,
      recentScores
    };

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router; 