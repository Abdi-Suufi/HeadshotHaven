import React, { createContext, useContext, useState } from 'react';
import { gameService } from '../services/gameService';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [leaderboards, setLeaderboards] = useState({
    aim: [],
    cps: [],
    reaction: []
  });
  const [userScores, setUserScores] = useState({
    aim: 0,
    cps: 0,
    reaction: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitScore = async (gameType, score, gameData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await gameService.submitScore(gameType, score, gameData);
      
      // Update user scores if this is a new best
      setUserScores(prev => ({
        ...prev,
        [gameType]: response.userBest
      }));

      // Refresh leaderboard
      await fetchLeaderboard(gameType);
      
      return response;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit score');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (gameType) => {
    try {
      setError(null);
      const response = await gameService.getLeaderboard(gameType);
      setLeaderboards(prev => ({
        ...prev,
        [gameType]: response.leaderboard
      }));
      return response.leaderboard;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch leaderboard');
      throw error;
    }
  };

  const fetchAllLeaderboards = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [aimLeaderboard, cpsLeaderboard, reactionLeaderboard] = await Promise.all([
        gameService.getLeaderboard('aim'),
        gameService.getLeaderboard('cps'),
        gameService.getLeaderboard('reaction')
      ]);

      setLeaderboards({
        aim: aimLeaderboard.leaderboard,
        cps: cpsLeaderboard.leaderboard,
        reaction: reactionLeaderboard.leaderboard
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const getUserHistory = async (gameType, limit = 10) => {
    try {
      setError(null);
      const response = await gameService.getHistory(gameType, limit);
      return response.history;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch game history');
      throw error;
    }
  };

  const resetScores = async (gameType) => {
    try {
      setError(null);
      await gameService.resetScores(gameType);
      
      // Reset user scores
      setUserScores(prev => ({
        ...prev,
        [gameType]: 0
      }));

      // Refresh leaderboards
      await fetchAllLeaderboards();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset scores');
      throw error;
    }
  };

  const updateUserScores = (scores) => {
    setUserScores(scores);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    leaderboards,
    userScores,
    loading,
    error,
    submitScore,
    fetchLeaderboard,
    fetchAllLeaderboards,
    getUserHistory,
    resetScores,
    updateUserScores,
    clearError
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 