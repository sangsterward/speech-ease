import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Box,
  Typography,
  SvgIconProps,
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

  // Get the first matching icon for preview
  const previewIconName = iconNames.find(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const PreviewIcon = previewIconName ? Icons[previewIconName as keyof typeof Icons] as React.ComponentType<SvgIconProps> : null;

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
        
        {/* Preview Section */}
        {searchTerm && PreviewIcon && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'action.hover',
              borderRadius: 1,
              mb: 2
            }}
          >
            <PreviewIcon sx={{ fontSize: 40 }} />
            <Typography variant="body1">
              {previewIconName}
            </Typography>
          </Box>
        )}

        <Grid container spacing={1} sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
          {iconNames.map((iconName) => {
            const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<SvgIconProps>;
            const isMatch = iconName.toLowerCase().includes(searchTerm.toLowerCase());
            
            return (
              <Grid item key={iconName} xs={2} sm={1}>
                <Tooltip title={iconName} arrow>
                  <IconButton
                    onClick={() => handleSelect(iconName)}
                    aria-label={`Select ${iconName} icon`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1',
                      border: '1px solid',
                      borderColor: isMatch ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      bgcolor: isMatch ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Icon sx={{ 
                      color: isMatch ? 'primary.main' : 'inherit',
                      opacity: isMatch ? 1 : 0.5
                    }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}; 