import React, { useState } from 'react';
import {
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Edit,
  Title,
  GridView,
  ArrowBack,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import { GridSizeDialog } from '../GridSizeDialog/GridSizeDialog';

export const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showGridDialog, setShowGridDialog] = useState(false);
  const { state, updateSettings, toggleEditMode, navigateToPage } = useApp();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMode = () => {
    toggleEditMode();
    handleClose();
  };

  const handleTitleChange = () => {
    const newTitle = window.prompt('Enter new app title:', state.settings.title);
    if (newTitle) {
      updateSettings({ title: newTitle });
    }
    handleClose();
  };

  const handleGridSize = () => {
    setShowGridDialog(true);
    handleClose();
  };

  const handleGridSizeSave = (rows: number, columns: number) => {
    updateSettings({
      gridSize: {
        rows,
        columns,
      },
    });
  };

  const handleBack = () => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage?.parentPageId) {
      navigateToPage(currentPage.parentPageId);
    }
    handleClose();
  };

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100, display: 'flex', alignItems: 'center', gap: 1 }}>
        {state.isEditMode && (
          <Chip
            icon={<EditIcon />}
            label="Edit Mode"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
        )}
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'menu-popup' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="open menu"
          color={state.isEditMode ? "primary" : "inherit"}
          sx={{
            bgcolor: state.isEditMode ? 'primary.light' : 'transparent',
            '&:hover': {
              bgcolor: state.isEditMode ? 'primary.main' : 'action.hover',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <MuiMenu
        id="menu-popup"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
          sx: {
            bgcolor: state.isEditMode ? 'primary.light' : 'background.paper',
          },
        }}
      >
        <MenuItem onClick={handleEditMode}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {state.isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTitleChange}>
          <ListItemIcon>
            <Title fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change App Title</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleGridSize}>
          <ListItemIcon>
            <GridView fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Grid Size</ListItemText>
        </MenuItem>
        {state.currentPageId !== 'main' && (
          <>
            <Divider />
            <MenuItem onClick={handleBack}>
              <ListItemIcon>
                <ArrowBack fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Back to {state.pages.find(p => p.id === state.pages.find(p => p.id === state.currentPageId)?.parentPageId)?.name || 'Main'}
              </ListItemText>
            </MenuItem>
          </>
        )}
      </MuiMenu>

      <GridSizeDialog
        open={showGridDialog}
        onClose={() => setShowGridDialog(false)}
        onSave={handleGridSizeSave}
        currentRows={state.settings.gridSize.rows}
        currentColumns={state.settings.gridSize.columns}
      />
    </>
  );
}; 