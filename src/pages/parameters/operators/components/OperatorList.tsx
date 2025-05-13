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
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { Operator } from '../types';
import { toggleOperator, deleteOperator } from '../services/operatorService';

interface OperatorListProps {
  operators: Operator[];
  onEdit: (operator: Operator) => void;
  onRefresh: () => void;
}

const OperatorList: React.FC<OperatorListProps> = ({
  operators,
  onEdit,
  onRefresh
}) => {
  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await toggleOperator(id, !currentStatus);
      onRefresh();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet opérateur ?')) {
      try {
        await deleteOperator(id);
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
            <TableCell>Logo</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Pays</TableCell>
            <TableCell>Code de détection</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operators.map((operator) => (
            <TableRow key={operator.id}>
              <TableCell>
                {operator.logoUrl && (
                  <Box
                    component="img"
                    src={operator.logoUrl}
                    alt={operator.nom}
                    sx={{ width: 40, height: 40, objectFit: 'contain' }}
                  />
                )}
              </TableCell>
              <TableCell>{operator.nom}</TableCell>
              <TableCell>{operator.pays}</TableCell>
              <TableCell>{operator.codeDetection}</TableCell>
              <TableCell>
                <Chip
                  label={operator.statut}
                  color={operator.statut === 'ACTIF' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(operator)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={operator.actif ? 'Désactiver' : 'Activer'}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggle(operator.id, operator.actif)}
                    color={operator.actif ? 'error' : 'success'}
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(operator.id)}
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

export default OperatorList; 