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

const GAME_TIME = 5; // 5 seconds as requested
const CANVAS_WIDTH = 960; // 800 * 1.2
const CANVAS_HEIGHT = 480; // 400 * 1.2

const CPSGame = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, countdown, running, finished
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(GAME_TIME);
  const [countdown, setCountdown] = useState(3);
  const [personalBest, setPersonalBest] = useState(0);
  const [cps, setCps] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const clickCountRef = useRef(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Draw initial canvas
    drawCanvas(ctx);
  }, []);

  // Draw canvas with gradient background
  const drawCanvas = (ctx) => {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2d2d2d');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (gameState !== 'running') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if click is within canvas bounds
    if (mouseX >= 0 && mouseX <= CANVAS_WIDTH && mouseY >= 0 && mouseY <= CANVAS_HEIGHT) {
      setClickCount(prev => prev + 1);
      clickCountRef.current += 1;
      
      // Draw click effect
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Clear effect after a short delay
      setTimeout(() => {
        drawCanvas(ctx);
      }, 100);
    }
  };

  // Game loop and animation
  useEffect(() => {
    let animationId;
    if (gameState === 'running') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let startTimestamp = performance.now();
      if (!startTimeRef.current) startTimeRef.current = startTimestamp;

      const animate = (timestamp) => {
        if (gameState !== 'running') return;
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsedTime = timestamp - startTimeRef.current;
        const timeLeft = Math.max((GAME_TIME * 1000 - elapsedTime) / 1000, 0);
        setTimer(timeLeft);
        
        if (timeLeft > 0) {
          animationId = requestAnimationFrame(animate);
        } else {
          // Game finished
          const finalCPS = clickCountRef.current / GAME_TIME;
          setCps(finalCPS);
          setGameState('finished');
          setResultDialog(true);
          if (finalCPS > personalBest) {
            setPersonalBest(finalCPS);
          }
        }
      };
      animationId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Start countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setClickCount(0);
    clickCountRef.current = 0;
    setCps(0);
    startTimeRef.current = null;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('running');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start game
  const startGame = () => {
    setResultDialog(false);
    startCountdown();
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
      await gameService.submitCPSScore(cps, {
        clicks: clickCount,
        time: GAME_TIME,
        cps: cps
      });
      setResultDialog(false);
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
            <SportsEsportsIcon sx={{ fontSize: 48, mb: -1, mr: 2 }} /> CPS Test
          </Typography>
          
          {/* Game Stats */}
          <Box mb={3}>
            <Typography variant="h4" color="#fff" display="inline" mr={4}>
              Personal Best: <b style={{ color: '#ff6b35' }}>{personalBest.toFixed(2)} CPS</b>
            </Typography>
            <Typography variant="h5" color="#fff" display="inline" mr={4}>
              Clicks: <b style={{ color: '#4caf50' }}>{clickCount}</b>
            </Typography>
            <Typography variant="h5" color="#fff" display="inline">
              <b style={{ color: timer <= 1 ? '#f44336' : '#ff6b35' }}>{timer.toFixed(1)}</b> seconds
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
                cursor: gameState === 'running' ? 'pointer' : 'not-allowed',
                display: 'block'
              }}
            />
            {gameState === 'countdown' && countdown > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontSize: '72px',
                  fontWeight: 'bold',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
                }}
              >
                {countdown}
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
            disabled={gameState === 'countdown' || gameState === 'running'}
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
             gameState === 'countdown' ? `${countdown}...` :
             gameState === 'running' ? 'Test Running' : 'Try Again'}
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
        {gameState === 'running' && (
          <Box textAlign="center">
            <Typography variant="h6" color="#ff6b35" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Click as fast as you can for 5 seconds!
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
          {cps > personalBest ? '🎉 New High Score! 🎉' : 'Test Complete'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Your CPS: <b style={{ color: '#ff6b35' }}>{cps.toFixed(2)}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Total Clicks: <b style={{ color: '#ff6b35' }}>{clickCount}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Time: <b style={{ color: '#f7931e' }}>{GAME_TIME}</b> seconds
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Personal Best: <b style={{ color: '#4caf50' }}>{personalBest.toFixed(2)} CPS</b>
          </Typography>
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

export default CPSGame; 