import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useAuth } from '../contexts/AuthContext';
import { gameService } from '../services/gameService';

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 480;
const MIN_DELAY = 1000; // Minimum 1 second delay
const MAX_DELAY = 5000; // Maximum 5 second delay

const ReactionGame = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, red, green, finished
  const [reactionTime, setReactionTime] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const startTimeRef = useRef(null);
  const greenStartTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Draw initial white canvas
    drawWhiteCanvas(ctx);
  }, []);

  // Draw white canvas
  const drawWhiteCanvas = (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  // Draw red canvas
  const drawRedCanvas = (ctx) => {
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  // Draw green canvas
  const drawGreenCanvas = (ctx) => {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (gameState === 'green') {
      const endTime = performance.now();
      const reactionTimeMs = endTime - greenStartTimeRef.current;
      
      setReactionTime(reactionTimeMs);
      setGameState('finished');
      setResultDialog(true);
      
      if (reactionTimeMs < personalBest || personalBest === 0) {
        setPersonalBest(reactionTimeMs);
      }
    } else if (gameState === 'red') {
      // Too early click
      setReactionTime(0);
      setGameState('finished');
      setResultDialog(true);
    }
  };

  // Start game
  const startGame = () => {
    setGameState('red');
    setReactionTime(0);
    setResultDialog(false);
    
    // Turn canvas red immediately
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawRedCanvas(ctx);
    
    // Random delay between MIN_DELAY and MAX_DELAY
    const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
    
    timeoutRef.current = setTimeout(() => {
      // Turn canvas green and start timer
      drawGreenCanvas(ctx);
      setGameState('green');
      greenStartTimeRef.current = performance.now();
    }, delay);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Refresh page
  const refreshPage = () => {
    window.location.reload();
  };

  // Submit score
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await gameService.submitReactionScore(reactionTime, {
        reactionTime: reactionTime,
        gameType: 'reaction'
      });
      setResultDialog(false);
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Video Background (if available) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <source src={require('../assets/video/pulse.mp4')} type="video/mp4" />
        </video>
        {/* fallback overlay */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)'
        }} />
      </Box>

      <Container 
        ref={containerRef}
        maxWidth={false} 
        sx={{ 
          py: 4, 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h3" fontWeight="bold" color="#ff6b35" gutterBottom>
            <SportsEsportsIcon sx={{ fontSize: 48, mb: -1, mr: 2 }} /> Reaction Speed Test
          </Typography>
          
          {/* Game Stats */}
          <Box mb={3}>
            <Typography variant="h4" color="#fff" display="inline" mr={4}>
              Personal Best: <b style={{ color: '#ff6b35' }}>{personalBest > 0 ? `${personalBest.toFixed(0)}ms` : 'N/A'}</b>
            </Typography>
            <Typography variant="h5" color="#fff" display="inline">
              Status: <b style={{ 
                color: gameState === 'ready' ? '#ff6b35' : 
                       gameState === 'red' ? '#d32f2f' : 
                       gameState === 'green' ? '#4caf50' : '#666'
              }}>
                {gameState === 'ready' ? 'Ready' : 
                 gameState === 'red' ? 'Wait for Green!' : 
                 gameState === 'green' ? 'Click Now!' : 'Finished'}
              </b>
            </Typography>
          </Box>
        </Box>

        {/* Game Canvas */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              border: '3px solid #333',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#111',
              boxShadow: '0 0 30px rgba(255, 107, 53, 0.3)',
              position: 'relative'
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasClick}
              style={{
                cursor: (gameState === 'green' || gameState === 'red') ? 'pointer' : 'not-allowed',
                display: 'block'
              }}
            />
            {gameState === 'red' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
                }}
              >
                Wait for green!
              </Box>
            )}
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={startGame}
            disabled={gameState === 'red' || gameState === 'green'}
            sx={{
              bgcolor: '#ff6b35',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 4,
              '&:hover': { bgcolor: '#e55a2b' },
              '&:disabled': { bgcolor: '#666' }
            }}
          >
            {gameState === 'ready' ? 'Start Test' : 
             gameState === 'red' ? 'Waiting...' :
             gameState === 'green' ? 'Click Canvas!' : 'Try Again'}
          </Button>
          <IconButton
            onClick={refreshPage}
            sx={{
              color: '#ff6b35',
              fontSize: '36px',
              '&:hover': { color: '#e55a2b' }
            }}
            title="Refresh"
          >
            <RefreshIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: '#ff6b35',
              fontSize: '36px',
              '&:hover': { color: '#e55a2b' }
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? 
              <FullscreenExitIcon sx={{ fontSize: 'inherit' }} /> : 
              <FullscreenIcon sx={{ fontSize: 'inherit' }} />
            }
          </IconButton>
        </Box>

        {/* Game Instructions */}
        {gameState === 'ready' && (
          <Box textAlign="center">
            <Typography variant="h6" color="#ff6b35" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Click when the canvas turns green!
            </Typography>
          </Box>
        )}
        {gameState === 'red' && (
          <Box textAlign="center">
            <Typography variant="h6" color="#d32f2f" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Wait for the canvas to turn green...
            </Typography>
          </Box>
        )}
        {gameState === 'green' && (
          <Box textAlign="center">
            <Typography variant="h6" color="#4caf50" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Click now!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Game Over Dialog */}
      <Dialog 
        open={resultDialog} 
        onClose={() => setResultDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#181818',
            color: '#fff',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff6b35', textAlign: 'center' }}>
          {reactionTime === 0 ? '❌ Too Early!' : 
           reactionTime < personalBest && personalBest > 0 ? '🎉 New Best Time! 🎉' : 'Test Complete'}
        </DialogTitle>
        <DialogContent>
          {reactionTime === 0 ? (
            <Typography gutterBottom sx={{ color: '#fff' }}>
              You clicked too early! Wait for the canvas to turn green.
            </Typography>
          ) : (
            <>
              <Typography gutterBottom sx={{ color: '#fff' }}>
                Your Reaction Time: <b style={{ color: '#ff6b35' }}>{reactionTime.toFixed(0)}ms</b>
              </Typography>
              <Typography gutterBottom sx={{ color: '#fff' }}>
                Personal Best: <b style={{ color: '#4caf50' }}>{personalBest > 0 ? `${personalBest.toFixed(0)}ms` : 'N/A'}</b>
              </Typography>
              <Typography gutterBottom sx={{ color: '#fff' }}>
                {reactionTime < 200 ? '⚡ Lightning Fast!' :
                 reactionTime < 300 ? '🚀 Very Fast!' :
                 reactionTime < 400 ? '👍 Good!' :
                 reactionTime < 500 ? '😐 Average' : '🐌 Slow'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={startGame} 
            sx={{ 
              bgcolor: '#ff6b35', 
              color: '#fff',
              '&:hover': { bgcolor: '#e55a2b' }
            }}
          >
            Try Again
          </Button>
          {user && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={submitting}
              sx={{ 
                bgcolor: '#4caf50', 
                color: '#fff',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              {submitting ? <CircularProgress size={20} /> : 'Submit Score'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReactionGame; 