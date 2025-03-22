import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Search } from '@mui/icons-material';

interface IconSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Get all icon names from @mui/icons-material
  const iconNames = Object.keys(Icons).filter(
    (key) => key !== 'default' && typeof Icons[key as keyof typeof Icons] === 'function'
  );

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select an Icon</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Grid container spacing={1} sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
          {filteredIcons.map((iconName) => {
            const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType;
            return (
              <Grid item key={iconName} xs={2} sm={1}>
                <IconButton
                  onClick={() => handleSelect(iconName)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}; 