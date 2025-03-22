import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { CloudUpload, Link as LinkIcon, PhotoCamera } from '@mui/icons-material';
import { convertImageToBase64, validateImage } from '../../utils/imageUtils';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}

export const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onImageSelect,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect(urlInput.trim());
      onClose();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file);
      const base64Image = await convertImageToBase64(file);
      onImageSelect(base64Image);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    try {
      validateImage(file);
      const base64Image = await convertImageToBase64(file);
      onImageSelect(base64Image);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const imageUrl = canvas.toDataURL('image/jpeg');
    onImageSelect(imageUrl);
    stopCamera();
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Image</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {showCamera ? (
          <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              mt: 2 
            }}>
              <Button
                variant="contained"
                onClick={capturePhoto}
                startIcon={<PhotoCamera />}
              >
                Capture Photo
              </Button>
              <Button
                variant="outlined"
                onClick={stopCamera}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Option 1: Upload from device
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
                <Typography>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  JPEG, PNG, GIF or WebP (max. 5MB)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Option 2: Take a photo
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={startCamera}
              >
                <PhotoCamera sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
                <Typography>
                  Click to open camera
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Option 3: Use image URL
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter image URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>
      {!showCamera && (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            variant="contained"
          >
            Add URL
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}; 