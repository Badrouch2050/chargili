import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TransactionList from './components/TransactionList';
import TransactionFilters from './components/TransactionFilters';
import TransactionExport from './components/TransactionExport';
import { Transaction, TransactionFilter } from './types';
import transactionService from './services/transactionService';

const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionService.getTransactions({
        ...filters,
        page: pagination.page,
        size: pagination.rowsPerPage
      });
      setTransactions(response.content);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements
      }));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page, pagination.rowsPerPage]);

  const handleFilterChange = (newFilters: TransactionFilter) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0
    }));
  };

  const handleViewDetails = (id: number) => {
    navigate(`/transactions/${id}`);
  };

  const handleExport = async (exportFilters: TransactionFilter) => {
    try {
      await transactionService.exportTransactions(exportFilters);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Transactions
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filtres */}
        <TransactionFilters
          onFilter={handleFilterChange}
        />

        {/* Liste des transactions */}
        <Paper sx={{ mt: 3 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <TransactionExport onExport={handleExport} />
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TransactionList
              transactions={transactions}
              onViewDetails={handleViewDetails}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default TransactionPage; 