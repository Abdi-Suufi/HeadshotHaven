import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  SportsEsports,
  Person,
  AdminPanelSettings,
  Logout,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import logo
import headshotLogo from '../assets/img/headshot-haven-logo.svg';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/');
  };

  const navItems = [
    { text: 'Aim Training', path: '/aim-training' },
    { text: 'CPS Game', path: '/cps-game' },
    { text: 'Reaction Game', path: '/reaction-game' },
    { text: 'Weapon Specs', path: '/weapon-specs' },
    { text: 'Roulette', path: '/roulette' },
    { text: 'Leaderboards', path: '/leaderboards' }
  ];

  const renderNavItems = () => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {navItems.map((item) => (
        <Button
          key={item.text}
          component={Link}
          to={item.path}
          sx={{ 
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: 'rgba(255, 107, 53, 0.1)',
              color: '#ff6b35'
            }
          }}
        >
          {item.text}
        </Button>
      ))}
    </Box>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        color="inherit"
        onClick={handleMobileMenuOpen}
        sx={{ display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        sx={{ 
          display: { md: 'none' },
          '& .MuiPaper-root': {
            bgcolor: '#1a1a1a',
            border: '1px solid #333'
          }
        }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleMobileMenuClose}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 107, 53, 0.1)',
                color: '#ff6b35'
              }
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAdmin && (
            <Button
              component={Link}
              to="/admin"
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35'
                }
              }}
              startIcon={<AdminPanelSettings />}
            >
              Admin
            </Button>
          )}
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{ color: 'inherit' }}
          >
            <Avatar
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: '#ff6b35',
                fontWeight: 'bold'
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || <Person />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            sx={{
              '& .MuiPaper-root': {
                bgcolor: '#1a1a1a',
                border: '1px solid #333'
              }
            }}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={handleUserMenuClose}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35'
                }
              }}
            >
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35'
                }
              }}
            >
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          component={Link}
          to="/login"
          sx={{
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(255, 107, 53, 0.1)',
              color: '#ff6b35'
            }
          }}
          startIcon={<Login />}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            bgcolor: '#ff6b35',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '20px',
            px: 2,
            '&:hover': {
              bgcolor: '#e55a2b'
            }
          }}
          startIcon={<PersonAdd />}
        >
          Register
        </Button>
      </Box>
    );
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        bgcolor: '#1a1a1a',
        borderBottom: '1px solid #333'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img 
              src={headshotLogo} 
              alt="Headshot Haven" 
              style={{ 
                height: '15px', 
                width: 'auto',
                filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.3))',
                cursor: 'pointer',
                transition: 'filter 0.2s ease',
                '&:hover': {
                  filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.5))'
                }
              }} 
            />
          </Link>
        </Box>

        {isMobile ? renderMobileMenu() : renderNavItems()}
        <Box sx={{ flexGrow: 1 }} />
        {renderAuthButtons()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 