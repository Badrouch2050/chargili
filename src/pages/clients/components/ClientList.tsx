import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ClientListItem, ClientSearchParams } from '../types';
import { clientService } from '../services/clientService';

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useState<ClientSearchParams>({
    page: 0,
    size: 10
  });

  const fetchClients = async () => {
    setError(null);
    try {
      const response = await clientService.searchClients(searchParams);
      setClients(response.content);
      setTotalElements(response.totalElements);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    setSearchParams(prev => ({ ...prev, page: 0, size: newSize }));
  };

  const handleSearchChange = (field: keyof ClientSearchParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchParams(prev => ({
      ...prev,
      [field]: value || undefined,
      page: 0
    }));
    setPage(0);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/clients/${id}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Liste des Clients
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Rechercher par nom"
          variant="outlined"
          size="small"
          value={searchParams.nom || ''}
          onChange={handleSearchChange('nom')}
        />
        <TextField
          label="Rechercher par email"
          variant="outlined"
          size="small"
          value={searchParams.email || ''}
          onChange={handleSearchChange('email')}
        />
        <TextField
          label="Statut"
          variant="outlined"
          size="small"
          value={searchParams.statut || ''}
          onChange={handleSearchChange('statut')}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.nom}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.statut}</TableCell>
                <TableCell>
                  {new Date(client.dateInscription).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      onClick={() => handleViewDetails(client.id)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Lignes par page"
      />
    </Box>
  );
};

export default ClientList; 