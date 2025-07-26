import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  SportsEsports,
  Speed,
  GpsFixed,
  Leaderboard,
  Google
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import assets
import headshotLogo from '../assets/img/headshot-haven-logo.svg';
import sceneImage from '../assets/img/scene.jpg';
import setupImage from '../assets/img/setup.jpg';
import testingImage from '../assets/img/testing.jpg';
import orangeImage from '../assets/img/orange4.jpg';

const Home = () => {
  const { isAuthenticated, googleLogin } = useAuth();

  const features = [
    {
      icon: <GpsFixed sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Aim Training',
      description: 'Improve your accuracy with our precision aim training game. Perfect for FPS gamers.',
      path: '/aim-training',
      image: testingImage
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#f7931e' }} />,
      title: 'CPS Test',
      description: 'Test your clicks per second and improve your clicking speed for competitive gaming.',
      path: '/cps-game',
      image: setupImage
    },
    {
      icon: <SportsEsports sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Reaction Speed',
      description: 'Enhance your reaction time with our quick response training game.',
      path: '/reaction-game',
      image: orangeImage
    },
    {
      icon: <Leaderboard sx={{ fontSize: 40, color: '#f7931e' }} />,
      title: 'Leaderboards',
      description: 'Compete with other players and track your progress on global leaderboards.',
      path: '/leaderboards',
      image: sceneImage
    }
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${sceneImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          py: 12,
          mb: 6,
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Box sx={{ mb: 4 }}>
              <img 
                src={headshotLogo} 
                alt="Headshot Haven" 
                style={{ 
                  maxWidth: '300px', 
                  height: 'auto',
                  filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.5))'
                }} 
              />
            </Box>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 107, 53, 0.3)',
                mb: 3
              }}
            >
              Welcome to Headshot Haven
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 6,
                color: '#b0b0b0',
                fontWeight: 300
              }}
            >
              Master your aim, speed, and reaction time with our FPS training platform
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#ff6b35',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: '25px',
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                      '&:hover': { 
                        bgcolor: '#e55a2b',
                        boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={googleLogin}
                    variant="outlined"
                    size="large"
                    startIcon={<Google />}
                    sx={{
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: '25px',
                      textTransform: 'none',
                      borderWidth: '2px',
                      '&:hover': { 
                        borderColor: '#e55a2b',
                        bgcolor: 'rgba(255, 107, 53, 0.1)',
                        borderWidth: '2px'
                      }
                    }}
                  >
                    Continue with Google
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/aim-training"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#ff6b35',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                    '&:hover': { 
                      bgcolor: '#e55a2b',
                      boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                    }
                  }}
                >
                  Start Training
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{
            color: '#ff6b35',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Training Features
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          sx={{ 
            mb: 8,
            color: '#b0b0b0',
            fontWeight: 300
          }}
        >
          Choose from our variety of training games to improve your gaming skills
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  bgcolor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(255, 107, 53, 0.2)',
                    borderColor: '#ff6b35'
                  }
                }}
              >
                <Box
                  sx={{
                    height: '200px',
                    backgroundImage: `url(${feature.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.8), rgba(247, 147, 30, 0.8))',
                      opacity: 0.7
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{
                      color: '#ff6b35',
                      fontWeight: 'bold'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#b0b0b0',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    component={Link}
                    to={feature.path}
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                      borderRadius: '20px',
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#e55a2b',
                        bgcolor: 'rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    Try Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: '#1a1a1a', borderTop: '1px solid #333' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{
              color: '#ff6b35',
              fontWeight: 'bold',
              mb: 6
            }}
          >
            Why Choose Headshot Haven?
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography 
                variant="h2" 
                sx={{
                  color: '#ff6b35',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
                }}
              >
                1000+
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Active Players
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: '#b0b0b0',
                  lineHeight: 1.6
                }}
              >
                Join our growing community of competitive gamers
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography 
                variant="h2" 
                sx={{
                  color: '#f7931e',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '0 0 20px rgba(247, 147, 30, 0.3)'
                }}
              >
                50K+
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Games Played
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: '#b0b0b0',
                  lineHeight: 1.6
                }}
              >
                Millions of training sessions completed
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography 
                variant="h2" 
                sx={{
                  color: '#ff6b35',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
                }}
              >
                24/7
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Available
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: '#b0b0b0',
                  lineHeight: 1.6
                }}
              >
                Train anytime, anywhere with our web platform
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 