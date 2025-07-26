import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Leaderboards = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Leaderboards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Leaderboards page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Leaderboards; 