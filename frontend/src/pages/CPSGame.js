import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CPSGame = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          CPS Game
        </Typography>
        <Typography variant="body1" color="text.secondary">
          CPS game coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default CPSGame; 