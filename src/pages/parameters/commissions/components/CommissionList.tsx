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
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Commission } from '../types';
import { deleteCommission } from '../services/commissionService';

interface CommissionListProps {
  commissions: Commission[];
  onEdit: (commission: Commission) => void;
  onRefresh: () => void;
}

const CommissionList: React.FC<CommissionListProps> = ({
  commissions,
  onEdit,
  onRefresh
}) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commission ?')) {
      try {
        await deleteCommission(id);
        onRefresh();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pays</TableCell>
            <TableCell>Opérateur</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Valeur</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell>{commission.pays}</TableCell>
              <TableCell>{commission.operateur || 'Global'}</TableCell>
              <TableCell>
                <Chip
                  label={commission.typeCommission}
                  color={commission.typeCommission === 'POURCENTAGE' ? 'primary' : 'secondary'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {commission.typeCommission === 'POURCENTAGE' 
                  ? `${commission.valeur}%`
                  : `${commission.valeur}€`}
              </TableCell>
              <TableCell>
                <Chip
                  label={commission.actif ? 'ACTIF' : 'INACTIF'}
                  color={commission.actif ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(commission)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(commission.id)}
                    color="error"
                  >
                    <DeleteIcon />
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

export default CommissionList; 