import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Roulette = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Roulette Game
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Roulette game coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Roulette; 