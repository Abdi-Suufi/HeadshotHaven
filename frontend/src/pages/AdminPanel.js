import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin panel coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminPanel; 