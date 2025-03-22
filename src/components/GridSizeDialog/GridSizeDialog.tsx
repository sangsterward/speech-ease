import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { GridView } from '@mui/icons-material';

interface GridSizeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (rows: number, columns: number) => void;
  currentRows: number;
  currentColumns: number;
}

const GridPreview: React.FC<{ rows: number; columns: number }> = ({ rows, columns }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 1,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: '100%',
        overflow: 'auto',
      }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Paper
          key={index}
          sx={{
            aspectRatio: '1',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: 'text.secondary',
            minWidth: 40,
            minHeight: 40,
          }}
        >
          {index + 1}
        </Paper>
      ))}
    </Box>
  );
};

export const GridSizeDialog: React.FC<GridSizeDialogProps> = ({
  open,
  onClose,
  onSave,
  currentRows,
  currentColumns,
}) => {
  const [rows, setRows] = React.useState(currentRows.toString());
  const [columns, setColumns] = React.useState(currentColumns.toString());
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRows(currentRows.toString());
    setColumns(currentColumns.toString());
  }, [currentRows, currentColumns]);

  const handleSave = () => {
    const newRows = parseInt(rows);
    const newColumns = parseInt(columns);

    if (isNaN(newRows) || isNaN(newColumns)) {
      setError('Please enter valid numbers');
      return;
    }

    if (newRows < 1 || newColumns < 1) {
      setError('Grid size must be at least 1x1');
      return;
    }

    if (newRows > 10 || newColumns > 10) {
      setError('Grid size cannot exceed 10x10');
      return;
    }

    setError(null);
    onSave(newRows, newColumns);
    onClose();
  };

  const previewRows = parseInt(rows) || currentRows;
  const previewColumns = parseInt(columns) || currentColumns;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GridView />
          <Typography variant="h6">Change Grid Size</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Number of Rows"
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              error={!!error}
              helperText={error}
              inputProps={{ min: 1, max: 10 }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Number of Columns"
              type="number"
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              error={!!error}
              inputProps={{ min: 1, max: 10 }}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Preview Layout
            </Typography>
            <GridPreview rows={previewRows} columns={previewColumns} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 