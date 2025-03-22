import React, { useState } from 'react';
import {
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Edit,
  Title,
  GridView,
  ArrowBack,
} from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';

export const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    const rows = window.prompt('Enter number of rows:', state.settings.gridSize.rows.toString());
    if (!rows) return handleClose();

    const columns = window.prompt('Enter number of columns:', state.settings.gridSize.columns.toString());
    if (!columns) return handleClose();

    const newRows = parseInt(rows);
    const newColumns = parseInt(columns);

    if (!isNaN(newRows) && !isNaN(newColumns)) {
      updateSettings({
        gridSize: {
          rows: newRows,
          columns: newColumns,
        },
      });
    }
    handleClose();
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
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'menu-popup' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="open menu"
        color="inherit"
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100 }}
      >
        <MenuIcon />
      </IconButton>
      <MuiMenu
        id="menu-popup"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
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
    </>
  );
}; 