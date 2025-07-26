import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const WeaponSpecs = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Weapon Specifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Weapon specifications page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default WeaponSpecs; 