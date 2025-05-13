import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { MainCurrency } from '../types';
import { toggleMainCurrency } from '../services/mainCurrencyService';

interface MainCurrencyListProps {
  currencies: MainCurrency[];
  onEdit: (currency: MainCurrency) => void;
  onRefresh: () => void;
}

const MainCurrencyList: React.FC<MainCurrencyListProps> = ({
  currencies,
  onEdit,
  onRefresh
}) => {
  const handleToggle = async (id: number) => {
    try {
      await toggleMainCurrency(id);
      onRefresh();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Symbole</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currencies.map((currency) => (
            <TableRow key={currency.id}>
              <TableCell>{currency.code}</TableCell>
              <TableCell>{currency.name}</TableCell>
              <TableCell>{currency.symbol}</TableCell>
              <TableCell>
                <Chip
                  label={currency.active ? 'Actif' : 'Inactif'}
                  color={currency.active ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(currency)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={currency.active ? 'Désactiver' : 'Activer'}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggle(currency.id)}
                    color={currency.active ? 'error' : 'success'}
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainCurrencyList; 