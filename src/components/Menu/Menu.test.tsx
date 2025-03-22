import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from './Menu';
import { useApp } from '../../contexts/AppContext';

jest.mock('../../contexts/AppContext', () => ({
  useApp: jest.fn(),
}));

describe('Menu', () => {
  const mockUpdateSettings = jest.fn();
  const mockToggleEditMode = jest.fn();
  const mockNavigateToPage = jest.fn();

  const defaultState = {
    settings: {
      title: 'SpeechEase',
      gridSize: {
        rows: 3,
        columns: 4,
      },
    },
    currentPageId: 'main',
    pages: [
      {
        id: 'main',
        name: 'Main',
      },
    ],
    isEditMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApp as jest.Mock).mockReturnValue({
      state: defaultState,
      updateSettings: mockUpdateSettings,
      toggleEditMode: mockToggleEditMode,
      navigateToPage: mockNavigateToPage,
    });
  });

  it('renders menu button', () => {
    render(<Menu />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('opens menu when button is clicked', () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    expect(screen.getByText('Enter Edit Mode')).toBeInTheDocument();
    expect(screen.getByText('Change App Title')).toBeInTheDocument();
    expect(screen.getByText('Change Grid Size')).toBeInTheDocument();
  });

  it('toggles edit mode', () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByText('Enter Edit Mode'));
    
    expect(mockToggleEditMode).toHaveBeenCalled();
  });

  it('changes app title', () => {
    window.prompt = jest.fn().mockReturnValue('New Title');
    render(<Menu />);
    
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByText('Change App Title'));
    
    expect(window.prompt).toHaveBeenCalledWith('Enter new app title:', 'SpeechEase');
    expect(mockUpdateSettings).toHaveBeenCalledWith({ title: 'New Title' });
  });

  it('changes grid size', () => {
    window.prompt = jest.fn()
      .mockReturnValueOnce('4')  // rows
      .mockReturnValueOnce('5'); // columns
    
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByText('Change Grid Size'));
    
    expect(window.prompt).toHaveBeenNthCalledWith(1, 'Enter number of rows:', '3');
    expect(window.prompt).toHaveBeenNthCalledWith(2, 'Enter number of columns:', '4');
    expect(mockUpdateSettings).toHaveBeenCalledWith({
      gridSize: { rows: 4, columns: 5 }
    });
  });

  it('shows back button when on sub-page', () => {
    (useApp as jest.Mock).mockReturnValue({
      state: {
        ...defaultState,
        currentPageId: 'sub-1',
        pages: [
          { id: 'main', name: 'Main' },
          { id: 'sub-1', name: 'Sub Page', parentPageId: 'main' },
        ],
      },
      updateSettings: mockUpdateSettings,
      toggleEditMode: mockToggleEditMode,
      navigateToPage: mockNavigateToPage,
    });

    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    const backButton = screen.getByText('Back to Main');
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockNavigateToPage).toHaveBeenCalledWith('main');
  });

  it('does not update settings when prompt is cancelled', () => {
    window.prompt = jest.fn().mockReturnValue(null);
    render(<Menu />);
    
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByText('Change App Title'));
    
    expect(mockUpdateSettings).not.toHaveBeenCalled();
  });

  it('validates grid size input', () => {
    window.prompt = jest.fn()
      .mockReturnValueOnce('invalid')  // rows
      .mockReturnValueOnce('5');       // columns
    
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    fireEvent.click(screen.getByText('Change Grid Size'));
    
    expect(mockUpdateSettings).not.toHaveBeenCalled();
  });

  it('closes menu when clicking outside', () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    expect(screen.getByText('Enter Edit Mode')).toBeInTheDocument();
    
    fireEvent.click(document.body);
    
    expect(screen.queryByText('Enter Edit Mode')).not.toBeInTheDocument();
  });
}); 