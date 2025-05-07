import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ClientDetails } from '../types';
import { clientService } from '../services/clientService';

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await clientService.getClientDetails(parseInt(id, 10));
        // Remplacer les valeurs nulles par des valeurs par défaut
        const processedData: ClientDetails = {
          ...data,
          nom: data.nom || '',
          email: data.email || '',
          statut: data.statut || 'INACTIF',
          actif: data.actif || false,
          dateInscription: data.dateInscription || new Date().toISOString(),
          montantTotalRecharge: data.montantTotalRecharge || 0,
          nombreRecharges: data.nombreRecharges || 0,
          montantMoyenRecharge: data.montantMoyenRecharge || 0,
          operateurPrefere: data.operateurPrefere || '',
          devisePaiement: data.devisePaiement || 'XOF',
          contactsFrequents: data.contactsFrequents || [],
          dernieresTransactions: data.dernieresTransactions || [],
          referralInfo: data.referralInfo ? {
            codeParrainage: data.referralInfo.codeParrainage || '',
            parrainEmail: data.referralInfo.parrainEmail || '',
            montantTotalParrainage: data.referralInfo.montantTotalParrainage || 0,
            bonusTotal: data.referralInfo.bonusTotal || 0,
            nombreRecharges: data.referralInfo.nombreRecharges || 0,
            statut: data.referralInfo.statut || 'INACTIF'
          } : undefined,
          litigesEnCours: data.litigesEnCours || []
        };
        setClient(processedData);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!client) {
    return <Alert severity="warning">Client non trouvé</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/clients')}
        sx={{ mb: 3 }}
      >
        Retour à la liste
      </Button>

      <Typography variant="h4" gutterBottom>
        Détails du Client
      </Typography>

      <Grid container spacing={3}>
        {/* Informations de base */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations Personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nom
                </Typography>
                <Typography>{client.nom}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{client.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Statut
                </Typography>
                <Chip
                  label={client.statut}
                  color={client.actif ? 'success' : 'error'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date d'inscription
                </Typography>
                <Typography>
                  {new Date(client.dateInscription).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Montant Total Rechargé
                </Typography>
                <Typography>
                  {client.montantTotalRecharge.toLocaleString()} {client.devisePaiement}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre de Recharges
                </Typography>
                <Typography>{client.nombreRecharges}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Montant Moyen
                </Typography>
                <Typography>
                  {client.montantMoyenRecharge.toLocaleString()} {client.devisePaiement}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Opérateur Préféré
                </Typography>
                <Typography>{client.operateurPrefere}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Contacts fréquents */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contacts Fréquents
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Numéro</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.contactsFrequents.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>{contact.nom || ''}</TableCell>
                      <TableCell>{contact.numero || ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Dernières transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dernières Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Opérateur</TableCell>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.dernieresTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.dateDemande).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.operateur || ''}</TableCell>
                      <TableCell>{transaction.numeroCible || ''}</TableCell>
                      <TableCell>
                        {(transaction.montant || 0).toLocaleString()} {transaction.devisePaiement || 'XOF'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.statut || 'INCONNU'}
                          color={
                            transaction.statut === 'TERMINEE' ? 'success' : 'warning'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Informations de parrainage */}
        {client.referralInfo && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informations de Parrainage
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Code de Parrainage
                  </Typography>
                  <Typography>{client.referralInfo.codeParrainage || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parrain
                  </Typography>
                  <Typography>{client.referralInfo.parrainEmail || ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Montant Total Parrainage
                  </Typography>
                  <Typography>
                    {(client.referralInfo.montantTotalParrainage || 0).toLocaleString()} {client.devisePaiement}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bonus Total
                  </Typography>
                  <Typography>
                    {(client.referralInfo.bonusTotal || 0).toLocaleString()} {client.devisePaiement}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Litiges en cours */}
        {client.litigesEnCours.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Litiges en Cours
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Motif</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Commentaire</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {client.litigesEnCours.map((litige) => (
                      <TableRow key={litige.id}>
                        <TableCell>
                          {new Date(litige.dateCreation).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{litige.motif || ''}</TableCell>
                        <TableCell>
                          <Chip
                            label={litige.statut || 'INCONNU'}
                            color={litige.statut === 'EN_COURS' ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>{litige.commentaire || ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClientDetailsPage; 