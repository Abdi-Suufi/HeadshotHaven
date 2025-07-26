import api from './api';

export const gameService = {
  // Submit aim training score
  submitAimScore: async (score, gameData = {}) => {
    const response = await api.post('/games/aim', {
      score,
      gameData
    });
    return response.data;
  },

  // Submit CPS score
  submitCPSScore: async (score, gameData = {}) => {
    const response = await api.post('/games/cps', {
      score,
      gameData
    });
    return response.data;
  },

  // Submit reaction speed score
  submitReactionScore: async (score, gameData = {}) => {
    const response = await api.post('/games/reaction', {
      score,
      gameData
    });
    return response.data;
  },

  // Generic score submission
  submitScore: async (gameType, score, gameData = {}) => {
    const response = await api.post(`/games/${gameType}`, {
      score,
      gameData
    });
    return response.data;
  },

  // Get aim training leaderboard
  getAimLeaderboard: async () => {
    const response = await api.get('/games/aim/leaderboard');
    return response.data;
  },

  // Get CPS leaderboard
  getCPSLeaderboard: async () => {
    const response = await api.get('/games/cps/leaderboard');
    return response.data;
  },

  // Get reaction speed leaderboard
  getReactionLeaderboard: async () => {
    const response = await api.get('/games/reaction/leaderboard');
    return response.data;
  },

  // Generic leaderboard fetch
  getLeaderboard: async (gameType) => {
    const response = await api.get(`/games/${gameType}/leaderboard`);
    return response.data;
  },

  // Get user's game history
  getHistory: async (gameType, limit = 10) => {
    const response = await api.get(`/games/history?gameType=${gameType}&limit=${limit}`);
    return response.data;
  },

  // Reset user's scores
  resetScores: async (gameType) => {
    const response = await api.delete('/games/reset-scores', {
      data: { gameType }
    });
    return response.data;
  }
}; 