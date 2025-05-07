import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import TransactionList from './components/TransactionList';
import TransactionDetails from './components/TransactionDetails';
import TransactionFilters from './components/TransactionFilters';
import { Transaction, TransactionFilter } from './types';
import transactionService from './services/transactionService';

const TransactionsPage: React.FC = () => {
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <TransactionFilters onFilter={handleFilterChange} />
        <TransactionList
          transactions={transactions}
          onViewDetails={handleViewDetails}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Container>
  );
};

export default TransactionsPage; 