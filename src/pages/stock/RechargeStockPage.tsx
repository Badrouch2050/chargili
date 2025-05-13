import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { getRechargeStocks, createRechargeStock, updateRechargeStock } from './services/rechargeStockService';
import { RechargeStock } from './types/rechargeStock';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const operateurs = ['Orange', 'Free', 'SFR', 'Bouygues'];
const pays = ['France', 'Belgique', 'Suisse', 'Luxembourg'];

const RechargeStockPage: React.FC = () => {
  const [stocks, setStocks] = useState<RechargeStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStock, setNewStock] = useState({
    pays: '',
    operateur: '',
    montant: 0
  });
  const [editingStock, setEditingStock] = useState<RechargeStock | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await getRechargeStocks(page, rowsPerPage);
      setStocks(response.content);
      setTotalElements(response.totalElements);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du stock de recharges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStock(null);
    setNewStock({
      pays: '',
      operateur: '',
      montant: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock(prev => ({
      ...prev,
      [name]: name === 'montant' ? Number(value) : value
    }));
  };

  const handleEdit = (stock: RechargeStock) => {
    setEditingStock(stock);
    setNewStock({
      pays: stock.pays,
      operateur: stock.operateur,
      montant: stock.montantTotal
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingStock) {
        await updateRechargeStock(editingStock.id, newStock);
      } else {
        await createRechargeStock(newStock);
      }
      handleCloseDialog();
      fetchStocks();
    } catch (err) {
      setError(editingStock ? 'Erreur lors de la modification du stock de recharges' : 'Erreur lors de la création du stock de recharges');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Stock de Recharges
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Ajouter
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Opérateur</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell>Montant Total</TableCell>
                <TableCell>Montant Disponible</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Date de modification</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.operateur}</TableCell>
                  <TableCell>{stock.pays}</TableCell>
                  <TableCell>{stock.montantTotal} €</TableCell>
                  <TableCell>
                    <Chip
                      label={`${stock.montantDisponible} €`}
                      color={stock.montantDisponible > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(stock.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(stock.dateModification), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(stock)}
                      size="small"
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count}`
          }
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStock ? 'Modifier la recharge' : 'Ajouter une nouvelle recharge'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Opérateur"
              name="operateur"
              value={newStock.operateur}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            >
              {operateurs.map((operateur) => (
                <MenuItem key={operateur} value={operateur}>
                  {operateur}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Pays"
              name="pays"
              value={newStock.pays}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            >
              {pays.map((pays) => (
                <MenuItem key={pays} value={pays}>
                  {pays}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Montant"
              name="montant"
              type="number"
              value={newStock.montant}
              onChange={handleInputChange}
              required
              InputProps={{
                endAdornment: '€'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingStock ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RechargeStockPage; 