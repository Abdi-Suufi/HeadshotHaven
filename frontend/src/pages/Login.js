import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Login page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Login; 