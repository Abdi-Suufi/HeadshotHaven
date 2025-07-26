import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AimTraining = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Aim Training
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aim training game coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default AimTraining; 