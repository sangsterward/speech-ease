import React from 'react';
import { Grid, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SpeechButton } from '../SpeechButton/SpeechButton';
import { useApp } from '../../contexts/AppContext';

export const ButtonGrid: React.FC = () => {
  const { state, updatePage } = useApp();
  const { currentPageId, pages, settings, isEditMode } = state;
  const currentPage = pages.find((page) => page.id === currentPageId);
  const { rows, columns } = settings.gridSize;

  const handleAddButton = () => {
    if (!currentPage) return;

    const newButton = {
      id: Date.now().toString(),
      text: 'New Button',
      imageUrl: '',
    };

    const updatedButtons = [...currentPage.buttons, newButton];
    updatePage(currentPageId, updatedButtons);
  };

  const gridCapacity = rows * columns;
  const showAddButton = isEditMode && currentPage && currentPage.buttons.length < gridCapacity;

  return (
    <Box sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 2,
        }}
      >
        {currentPage?.buttons.map((button) => (
          <Grid item xs={12 / columns} key={button.id}>
            <SpeechButton button={button} pageId={currentPageId} />
          </Grid>
        ))}
        {showAddButton && (
          <Grid item xs={12 / columns}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                height: '100%',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
              onClick={handleAddButton}
              aria-label="Add new button"
            >
              <Add fontSize="large" />
              Add Button
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}; 