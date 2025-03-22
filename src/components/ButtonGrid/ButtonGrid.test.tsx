import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGrid } from './ButtonGrid';
import { AppProvider } from '../../contexts/AppContext';
import { useApp } from '../../contexts/AppContext';

// Mock the useApp hook
jest.mock('../../contexts/AppContext', () => ({
  ...jest.requireActual('../../contexts/AppContext'),
  useApp: jest.fn(),
}));

// Mock the SpeechButton component
jest.mock('../SpeechButton/SpeechButton', () => ({
  SpeechButton: ({ button }: { button: { text: string } }) => (
    <div data-testid="speech-button">{button.text}</div>
  ),
}));

describe('ButtonGrid', () => {
  const mockUpdatePage = jest.fn();
  const defaultState = {
    currentPageId: 'main',
    pages: [
      {
        id: 'main',
        name: 'Main',
        buttons: [
          { id: '1', text: 'Button 1' },
          { id: '2', text: 'Button 2' },
        ],
      },
    ],
    settings: {
      gridSize: {
        rows: 2,
        columns: 2,
      },
    },
    isEditMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApp as jest.Mock).mockReturnValue({
      state: defaultState,
      updatePage: mockUpdatePage,
    });
  });

  it('renders the correct number of buttons', () => {
    render(<ButtonGrid />);
    const buttons = screen.getAllByTestId('speech-button');
    expect(buttons).toHaveLength(2);
  });

  it('applies the correct grid layout based on settings', () => {
    render(<ButtonGrid />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    });
  });

  it('shows add button in edit mode when there is space in the grid', () => {
    (useApp as jest.Mock).mockReturnValue({
      state: { ...defaultState, isEditMode: true },
      updatePage: mockUpdatePage,
    });

    render(<ButtonGrid />);
    const addButton = screen.getByRole('button', { name: /add new button/i });
    expect(addButton).toBeInTheDocument();
  });

  it('does not show add button when grid is full', () => {
    (useApp as jest.Mock).mockReturnValue({
      state: {
        ...defaultState,
        isEditMode: true,
        pages: [
          {
            id: 'main',
            name: 'Main',
            buttons: [
              { id: '1', text: 'Button 1' },
              { id: '2', text: 'Button 2' },
              { id: '3', text: 'Button 3' },
              { id: '4', text: 'Button 4' },
            ],
          },
        ],
      },
      updatePage: mockUpdatePage,
    });

    render(<ButtonGrid />);
    const addButton = screen.queryByRole('button', { name: /add new button/i });
    expect(addButton).not.toBeInTheDocument();
  });

  it('adds a new button when clicking the add button', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));

    (useApp as jest.Mock).mockReturnValue({
      state: { ...defaultState, isEditMode: true },
      updatePage: mockUpdatePage,
    });

    render(<ButtonGrid />);
    const addButton = screen.getByRole('button', { name: /add new button/i });
    
    fireEvent.click(addButton);

    expect(mockUpdatePage).toHaveBeenCalledWith('main', [
      { id: '1', text: 'Button 1' },
      { id: '2', text: 'Button 2' },
      { id: 'button-1704067200000', text: 'New Button' },
    ]);

    jest.useRealTimers();
  });

  it('returns null when current page is not found', () => {
    (useApp as jest.Mock).mockReturnValue({
      state: {
        ...defaultState,
        currentPageId: 'non-existent',
      },
      updatePage: mockUpdatePage,
    });

    const { container } = render(<ButtonGrid />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not show add button when not in edit mode', () => {
    render(<ButtonGrid />);
    const addButton = screen.queryByRole('button', { name: /add new button/i });
    expect(addButton).not.toBeInTheDocument();
  });
}); 