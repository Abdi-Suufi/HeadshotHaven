import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ReactionGame = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Reaction Speed Game
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reaction speed game coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ReactionGame; 