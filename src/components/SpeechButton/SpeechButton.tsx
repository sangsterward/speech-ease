import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { Image, EmojiEmotions } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { IconSelector } from '../IconSelector/IconSelector';
import { ImageUploadDialog } from '../ImageUploadDialog/ImageUploadDialog';

interface ButtonProps {
  id: string;
  text: string;
  imageUrl?: string;
  iconName?: string;
  subPageId?: string;
}

interface SpeechButtonProps {
  button: ButtonProps;
  pageId: string;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({ button, pageId }) => {
  const { state, updateButton, navigateToPage } = useApp();
  const { speak } = useSpeechSynthesis();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  const handleClick = () => {
    if (state.isEditMode) {
      const newText = window.prompt('Enter new text for button:', button.text);
      if (newText) {
        updateButton(pageId, button.id, { text: newText });
      }
    } else if (button.subPageId) {
      navigateToPage(button.subPageId);
    } else {
      speak(button.text);
    }
  };

  const handleMediaClick = (e: React.MouseEvent<HTMLElement>) => {
    if (state.isEditMode) {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageSelect = (imageUrl: string) => {
    updateButton(pageId, button.id, { 
      imageUrl,
      iconName: undefined 
    });
  };

  const handleIconSelect = (iconName: string) => {
    updateButton(pageId, button.id, { 
      iconName,
      imageUrl: undefined 
    });
  };

  const renderMedia = () => {
    if (button.imageUrl) {
      return (
        <CardMedia
          component="img"
          sx={{
            height: 140,
            objectFit: 'contain',
            padding: 1
          }}
          image={button.imageUrl}
          alt={button.text}
          onClick={handleMediaClick}
        />
      );
    } else if (button.iconName) {
      const Icon = Icons[button.iconName as keyof typeof Icons] as React.ComponentType;
      return (
        <Box
          onClick={handleMediaClick}
          sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 1
          }}
        >
          <Box sx={{ fontSize: 64 }}>
            <Icon />
          </Box>
        </Box>
      );
    }
    return state.isEditMode ? (
      <Box
        onClick={handleMediaClick}
        sx={{
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 1,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          cursor: 'pointer'
        }}
      >
        <Typography color="textSecondary">Click to add image or icon</Typography>
      </Box>
    ) : null;
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6
          }
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={button.text}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {renderMedia()}
        <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 1 }}>
          <Typography variant="h6" component="div">
            {button.text}
          </Typography>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          setImageUploadOpen(true);
        }}>
          <ListItemIcon>
            <Image fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Image" />
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          setIconSelectorOpen(true);
        }}>
          <ListItemIcon>
            <EmojiEmotions fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Choose Icon" />
        </MenuItem>
      </Menu>

      <IconSelector
        open={iconSelectorOpen}
        onClose={() => setIconSelectorOpen(false)}
        onSelect={handleIconSelect}
      />

      <ImageUploadDialog
        open={imageUploadOpen}
        onClose={() => setImageUploadOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </>
  );
}; 