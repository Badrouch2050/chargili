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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStockCards, createStockCard, updateStockCard, deleteStockCard } from './services/stockCardService';
import { StockCard } from './types/stockCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StockCardFilters from './components/StockCardFilters';
import StockCardForm, { StockCardFormData } from './components/StockCardForm';
import { useNavigate } from 'react-router-dom';

const StockCardPage: React.FC = () => {
  const [cards, setCards] = useState<StockCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({
    operateur: '',
    pays: '',
    statut: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StockCard | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await getStockCards(page, rowsPerPage, filters);
      setCards(response.content);
      setTotalElements(response.totalElements);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des cartes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const handleAddCard = async (data: StockCardFormData) => {
    try {
      await createStockCard(data);
      setIsFormOpen(false);
      fetchCards();
    } catch (err) {
      setError('Erreur lors de la création de la carte');
      console.error(err);
    }
  };

  const handleEditCard = async (data: StockCardFormData) => {
    if (!selectedCard) return;
    try {
      await updateStockCard(selectedCard.id, data);
      setIsFormOpen(false);
      setSelectedCard(null);
      setIsEdit(false);
      fetchCards();
    } catch (err) {
      setError('Erreur lors de la modification de la carte');
      console.error(err);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    try {
      await deleteStockCard(selectedCard.id);
      setIsDeleteDialogOpen(false);
      setSelectedCard(null);
      fetchCards();
    } catch (err) {
      setError('Erreur lors de la suppression de la carte');
      console.error(err);
    }
  };

  const openEditForm = (card: StockCard) => {
    setSelectedCard(card);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (card: StockCard) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/stock-cartes/${id}`);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Liste des Cartes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setIsEdit(false);
            setSelectedCard(null);
            setIsFormOpen(true);
          }}
        >
          Ajouter une carte
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StockCardFilters filters={filters} onFilterChange={handleFilterChange} />

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Opérateur</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date d'ajout</TableCell>
                <TableCell>Date d'utilisation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card) => (
                <TableRow 
                  key={card.id}
                  hover
                  onClick={() => handleViewDetails(card.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{card.code}</TableCell>
                  <TableCell>{card.operateur}</TableCell>
                  <TableCell>{card.pays}</TableCell>
                  <TableCell>{card.montant} €</TableCell>
                  <TableCell>{card.statut}</TableCell>
                  <TableCell>
                    {format(new Date(card.dateAjout), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {card.dateUtilisation
                      ? format(new Date(card.dateUtilisation), 'dd/MM/yyyy HH:mm', { locale: fr })
                      : '-'}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      color="primary"
                      onClick={() => openEditForm(card)}
                      disabled={card.statut === 'UTILISE'}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(card)}
                      disabled={card.statut === 'UTILISE'}
                    >
                      <DeleteIcon />
                    </IconButton>
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

      <StockCardForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCard(null);
          setIsEdit(false);
        }}
        onSubmit={isEdit ? handleEditCard : handleAddCard}
        initialData={selectedCard ? {
          operateur: selectedCard.operateur,
          montant: selectedCard.montant,
          code: selectedCard.code,
          pays: selectedCard.pays
        } : undefined}
        isEdit={isEdit}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteCard} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockCardPage; 