import React, { useState } from 'react';
import { Paper, TextField, IconButton, Box } from '@mui/material';
import { PlayArrow, Clear } from '@mui/icons-material';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export const SpeechBar: React.FC = () => {
  const [text, setText] = useState('');
  const { speak, speaking } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (text.trim()) {
      speak(text);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSpeak();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 600,
        zIndex: 1000
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to speak..."
        size="small"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          color="primary"
          onClick={handleSpeak}
          disabled={!text.trim() || speaking}
          aria-label="Speak text"
        >
          <PlayArrow />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={handleClear}
          disabled={!text}
          aria-label="Clear text"
        >
          <Clear />
        </IconButton>
      </Box>
    </Paper>
  );
}; 