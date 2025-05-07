import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Transaction, TransactionFilter, TransactionListItem } from '../types';
import transactionService from '../services/transactionService';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (id: number) => void;
  pagination: {
    page: number;
    rowsPerPage: number;
    total: number;
  };
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  pagination,
  onPageChange,
  onRowsPerPageChange
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'VALIDEE':
        return 'success';
      case 'EN_ATTENTE':
        return 'warning';
      case 'ECHOUEE':
        return 'error';
      default:
        return 'default';
    }
  };

  // Convertir les transactions en TransactionListItem
  const transactionItems: TransactionListItem[] = transactions.map(transaction => ({
    id: transaction.id,
    numero: transaction.numero,
    montant: transaction.montant,
    devisePaiement: transaction.devisePaiement,
    operateur: transaction.operateur,
    pays: transaction.pays,
    statut: transaction.statut,
    typeTraitement: transaction.typeTraitement,
    dateDemande: transaction.dateDemande,
    clientNom: transaction.client?.nom   || 'N/A',
    clientId: transaction.client?.id || 0
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Liste des Transactions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Opérateur</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionItems.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.numero}</TableCell>
                <TableCell>{transaction.clientNom}</TableCell>
                <TableCell>
                  {transaction.montant.toLocaleString()} {transaction.devisePaiement}
                </TableCell>
                <TableCell>{transaction.operateur}</TableCell>
                <TableCell>{transaction.pays}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.statut}
                    color={getStatusColor(transaction.statut)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.typeTraitement}</TableCell>
                <TableCell>
                  {new Date(transaction.dateDemande).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      onClick={() => onViewDetails(transaction.id)}
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
        count={pagination.total}
        page={pagination.page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Lignes par page"
      />
    </Box>
  );
};

export default TransactionList; 