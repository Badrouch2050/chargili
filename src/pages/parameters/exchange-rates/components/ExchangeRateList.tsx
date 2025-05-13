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
import { ExchangeRate } from '../services/exchangeRateService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface ExchangeRateListProps {
  rates: ExchangeRate[];
  onEdit: (rate: ExchangeRate) => void;
  onRefresh: () => void;
}

const ExchangeRateList: React.FC<ExchangeRateListProps> = ({
  rates,
  onEdit,
  onRefresh
}) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Devise Source</TableCell>
            <TableCell>Devise Cible</TableCell>
            <TableCell>Taux</TableCell>
            <TableCell>Date d'obtention</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rates.map((rate) => (
            <TableRow 
              key={rate.id}
              hover
              onClick={() => navigate(`/parameters/exchange-rates/${rate.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{rate.deviseSource}</TableCell>
              <TableCell>{rate.deviseCible}</TableCell>
              <TableCell>{rate.taux.toFixed(4)}</TableCell>
              <TableCell>
                {format(new Date(rate.dateObtention), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                <Chip
                  label={rate.actif ? 'Actif' : 'Inactif'}
                  color={rate.actif ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(rate);
                    }}
                  >
                    <EditIcon />
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

export default ExchangeRateList; 