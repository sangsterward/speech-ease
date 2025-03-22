import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeechButton } from './SpeechButton';
import { useApp } from '../../contexts/AppContext';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

// Mock the hooks
jest.mock('../../contexts/AppContext', () => ({
  useApp: jest.fn(),
}));

jest.mock('../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: jest.fn(),
}));

describe('SpeechButton', () => {
  const mockSpeak = jest.fn();
  const mockNavigateToPage = jest.fn();
  const mockUpdateButton = jest.fn();

  const defaultButton = {
    id: '1',
    text: 'Test Button',
    imageUrl: 'test-image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSpeechSynthesis as jest.Mock).mockReturnValue({
      speak: mockSpeak,
      speaking: false,
    });
    (useApp as jest.Mock).mockReturnValue({
      state: { isEditMode: false },
      navigateToPage: mockNavigateToPage,
      updateButton: mockUpdateButton,
    });
  });

  it('renders button with text and image', () => {
    render(<SpeechButton button={defaultButton} pageId="main" />);
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    const image = screen.getByAltText('Test Button');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('speaks text when clicked in normal mode', () => {
    render(<SpeechButton button={defaultButton} pageId="main" />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockSpeak).toHaveBeenCalledWith('Test Button');
  });

  it('navigates to sub-page when button has subPageId', () => {
    const buttonWithSubPage = { ...defaultButton, subPageId: 'sub-1' };
    render(<SpeechButton button={buttonWithSubPage} pageId="main" />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigateToPage).toHaveBeenCalledWith('sub-1');
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      (useApp as jest.Mock).mockReturnValue({
        state: { isEditMode: true },
        navigateToPage: mockNavigateToPage,
        updateButton: mockUpdateButton,
      });
    });

    it('allows text editing when in edit mode', () => {
      window.prompt = jest.fn().mockReturnValue('New Text');
      render(<SpeechButton button={defaultButton} pageId="main" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(window.prompt).toHaveBeenCalledWith('Enter new text for button:', 'Test Button');
      expect(mockUpdateButton).toHaveBeenCalledWith('main', '1', { text: 'New Text' });
    });

    it('allows image editing when in edit mode', () => {
      window.prompt = jest.fn().mockReturnValue('new-image.jpg');
      render(<SpeechButton button={defaultButton} pageId="main" />);
      
      fireEvent.click(screen.getByRole('img'));
      
      expect(window.prompt).toHaveBeenCalledWith('Enter new image URL:', 'test-image.jpg');
      expect(mockUpdateButton).toHaveBeenCalledWith('main', '1', { imageUrl: 'new-image.jpg' });
    });

    it('does not update when prompt is cancelled', () => {
      window.prompt = jest.fn().mockReturnValue(null);
      render(<SpeechButton button={defaultButton} pageId="main" />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(mockUpdateButton).not.toHaveBeenCalled();
    });
  });

  it('handles keyboard navigation', () => {
    render(<SpeechButton button={defaultButton} pageId="main" />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(mockSpeak).toHaveBeenCalledWith('Test Button');
    
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(mockSpeak).toHaveBeenCalledWith('Test Button');
  });
}); 