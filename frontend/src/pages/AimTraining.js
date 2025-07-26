import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useAuth } from '../contexts/AuthContext';
import { gameService } from '../services/gameService';

const GAME_TIME = 30; // seconds
const BALL_RADIUS = 30;
const GRID_SIZE = 100;

const AimTraining = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, countdown, running, finished
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(GAME_TIME);
  const [countdown, setCountdown] = useState(3);
  const [personalBest, setPersonalBest] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [successfulClicks, setSuccessfulClicks] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [crosshairCode, setCrosshairCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const ballsRef = useRef([]);
  const gridPointsRef = useRef([]);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize canvas and grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 650;

    // Create grid points
    const cols = Math.floor(canvas.width / GRID_SIZE);
    const rows = Math.floor(canvas.height / GRID_SIZE);
    const gridPoints = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * GRID_SIZE + GRID_SIZE / 2;
        const y = j * GRID_SIZE + GRID_SIZE / 2;
        gridPoints.push({ x, y });
      }
    }
    gridPointsRef.current = gridPoints;
  }, []);

  // Create balls function
  const createBalls = () => {
    const availablePoints = [...gridPointsRef.current];
    const balls = [];

    for (let i = 0; i < 3; i++) {
      if (availablePoints.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availablePoints.length);
      const { x, y } = availablePoints.splice(randomIndex, 1)[0];
      balls.push({
        x,
        y,
        radius: BALL_RADIUS,
        color: "rgb(255, 100, 66)",
      });
    }
    ballsRef.current = balls;
  };

  // Draw functions
  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawBalls = (ctx) => {
    ballsRef.current.forEach((ball) => {
      drawBall(ctx, ball);
    });
  };

  const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  // Click detection
  const isInsideBall = (ball, mouseX, mouseY) => {
    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
    return distance <= ball.radius;
  };

  const handleCanvasClick = (event) => {
    if (gameState !== 'running') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setTotalClicks(prev => prev + 1);

    let ballClicked = false;

    ballsRef.current.forEach((ball, index) => {
      if (isInsideBall(ball, mouseX, mouseY)) {
        resetBall(ball);
        setScore(prev => prev + 1);
        setSuccessfulClicks(prev => prev + 1);
        ballClicked = true;
      }
    });

    if (!ballClicked) {
      setScore(prev => prev - 1);
    }
  };

  // Reset ball function
  const resetBall = (ball) => {
    ball.x = -100;
    ball.y = -100;

    const availablePoints = [...gridPointsRef.current];
    const randomIndex = Math.floor(Math.random() * availablePoints.length);
    const { x, y } = availablePoints.splice(randomIndex, 1)[0];

    const newBall = {
      x,
      y,
      radius: BALL_RADIUS,
      color: "rgb(255, 100, 66)",
    };
    ballsRef.current.push(newBall);
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
        clearCanvas(ctx);
        drawBalls(ctx);
        if (timeLeft > 0) {
          animationId = requestAnimationFrame(animate);
        } else {
          setGameState('finished');
          setResultDialog(true);
          if (score > personalBest) {
            setPersonalBest(score);
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

  // Ensure balls are created when game starts
  useEffect(() => {
    if (gameState === 'running') {
      createBalls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Start countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setTotalClicks(0);
    setSuccessfulClicks(0);
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

  // Generate crosshair
  const generateCrosshair = () => {
    if (crosshairCode.trim()) {
      // This would typically send the crosshair code to a CS:GO crosshair generator
      // For now, we'll just show an alert
      alert(`Crosshair code "${crosshairCode}" would be generated!`);
    }
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
      const accuracy = totalClicks === 0 ? 0 : (successfulClicks / totalClicks) * 100;
      await gameService.submitAimScore(score, {
        accuracy: Number(accuracy.toFixed(2)),
        hits: successfulClicks,
        clicks: totalClicks,
        time: GAME_TIME
      });
      setResultDialog(false);
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate accuracy
  const accuracy = totalClicks === 0 ? 0 : (successfulClicks / totalClicks) * 100;

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
            <SportsEsportsIcon sx={{ fontSize: 48, mb: -1, mr: 2 }} /> Aim Training
          </Typography>
          
          {/* Game Stats */}
          <Box mb={3}>
            <Typography variant="h4" color="#fff" display="inline" mr={4}>
              Personal Best: <b style={{ color: '#ff6b35' }}>{personalBest}</b>
            </Typography>
            <Typography variant="h5" color="#fff" display="inline" mr={4}>
              Accuracy: <b style={{ color: '#4caf50' }}>{accuracy.toFixed(1)}%</b>
            </Typography>
            <Typography variant="h5" color="#fff" display="inline">
              <b style={{ color: timer <= 5 ? '#f44336' : '#ff6b35' }}>{timer.toFixed(1)}</b> seconds
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
                cursor: gameState === 'running' ? 'pointer' : 'default',
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
          <TextField
            placeholder="Enter Crosshair Code"
            value={crosshairCode}
            onChange={(e) => setCrosshairCode(e.target.value)}
            sx={{
              maxWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#ff6b35',
                },
                '&:hover fieldset': {
                  borderColor: '#ff6b35',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={generateCrosshair}
            sx={{
              bgcolor: '#ff6b35',
              color: '#fff',
              '&:hover': { bgcolor: '#e55a2b' }
            }}
          >
            Generate Crosshair
          </Button>
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
            {gameState === 'ready' ? 'Start Game' : 
             gameState === 'countdown' ? `${countdown}...` :
             gameState === 'running' ? 'Game Running' : 'Play Again'}
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
              Click the orange balls as fast as you can!
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
          {score > personalBest ? '🎉 New High Score! 🎉' : 'Game Over'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Score: <b style={{ color: '#ff6b35' }}>{score}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Hits: <b style={{ color: '#ff6b35' }}>{successfulClicks}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Clicks: <b style={{ color: '#f7931e' }}>{totalClicks}</b>
          </Typography>
          <Typography gutterBottom sx={{ color: '#fff' }}>
            Accuracy: <b style={{ color: '#4caf50' }}>{accuracy.toFixed(1)}%</b>
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
            Play Again
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

export default AimTraining; 