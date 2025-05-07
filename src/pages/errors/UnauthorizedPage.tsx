import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Accès non autorisé
          </Typography>
          <Typography variant="body1" paragraph>
            Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </Typography>
          <Typography variant="body2" paragraph color="text.secondary">
            Seuls les administrateurs peuvent accéder à la backoffice de CHARGILI.
            Si vous pensez que c'est une erreur, veuillez contacter l'administrateur système.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Retour à la page de connexion
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 