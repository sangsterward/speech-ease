import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SpeechButton } from './SpeechButton';
import { AppProvider } from '../../contexts/AppContext';
import { useApp } from '../../contexts/AppContext';

// Mock the speech synthesis hook
jest.mock('../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => ({
    speak: jest.fn(),
  }),
}));

// Test wrapper component to provide context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppProvider>{children}</AppProvider>;
};

// Helper component to access context in tests
const TestComponent: React.FC<{ button: any; pageId: string }> = ({ button, pageId }) => {
  const { state } = useApp();
  return (
    <div>
      <div data-testid="edit-mode">{state.isEditMode.toString()}</div>
      <SpeechButton button={button} pageId={pageId} />
    </div>
  );
};

describe('SpeechButton', () => {
  const mockButton = {
    id: 'test-button',
    text: 'Test Button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with text', () => {
    render(
      <TestWrapper>
        <TestComponent button={mockButton} pageId="main" />
      </TestWrapper>
    );
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('speaks text when clicked in normal mode', () => {
    const { speak } = require('../../hooks/useSpeechSynthesis');
    render(
      <TestWrapper>
        <TestComponent button={mockButton} pageId="main" />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Test Button'));
    expect(speak).toHaveBeenCalledWith('Test Button');
  });

  it('shows edit dialog when clicked in edit mode', async () => {
    render(
      <TestWrapper>
        <TestComponent button={mockButton} pageId="main" />
      </TestWrapper>
    );

    // Enter edit mode
    const { toggleEditMode } = useApp();
    toggleEditMode();

    // Click the button
    fireEvent.click(screen.getByText('Test Button'));

    // Verify prompt appears
    const promptSpy = jest.spyOn(window, 'prompt');
    promptSpy.mockReturnValue('New Button Text');

    // Wait for the prompt to be handled
    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalledWith('Enter new text for button:', 'Test Button');
    });
  });

  describe('Sub-page functionality', () => {
    it('shows create sub-page option in edit mode', async () => {
      render(
        <TestWrapper>
          <TestComponent button={mockButton} pageId="main" />
        </TestWrapper>
      );

      // Enter edit mode
      const { toggleEditMode } = useApp();
      toggleEditMode();

      // Click the media area to open menu
      const mediaArea = screen.getByRole('button');
      fireEvent.click(mediaArea);

      // Verify create sub-page option is present
      expect(screen.getByText('Create Sub-page')).toBeInTheDocument();
    });

    it('creates a new sub-page when option is selected', async () => {
      render(
        <TestWrapper>
          <TestComponent button={mockButton} pageId="main" />
        </TestWrapper>
      );

      // Enter edit mode
      const { toggleEditMode } = useApp();
      toggleEditMode();

      // Click the media area to open menu
      const mediaArea = screen.getByRole('button');
      fireEvent.click(mediaArea);

      // Click create sub-page option
      fireEvent.click(screen.getByText('Create Sub-page'));

      // Enter sub-page name
      const input = screen.getByLabelText('Sub-page Name');
      await userEvent.type(input, 'New Sub-page');

      // Click create button
      fireEvent.click(screen.getByText('Create'));

      // Verify the button now has a sub-page indicator
      expect(screen.getByTestId('NavigateNextIcon')).toBeInTheDocument();
    });

    it('navigates to sub-page when clicked in normal mode', () => {
      const buttonWithSubPage = {
        ...mockButton,
        subPageId: 'sub-page-1',
      };

      render(
        <TestWrapper>
          <TestComponent button={buttonWithSubPage} pageId="main" />
        </TestWrapper>
      );

      const { navigateToPage } = useApp();
      const navigateSpy = jest.spyOn({ navigateToPage }, 'navigateToPage');

      // Click the button
      fireEvent.click(screen.getByText('Test Button'));

      // Verify navigation to sub-page
      expect(navigateSpy).toHaveBeenCalledWith('sub-page-1');
    });

    it('shows go to sub-page option in edit mode for buttons with sub-pages', async () => {
      const buttonWithSubPage = {
        ...mockButton,
        subPageId: 'sub-page-1',
      };

      render(
        <TestWrapper>
          <TestComponent button={buttonWithSubPage} pageId="main" />
        </TestWrapper>
      );

      // Enter edit mode
      const { toggleEditMode } = useApp();
      toggleEditMode();

      // Click the media area to open menu
      const mediaArea = screen.getByRole('button');
      fireEvent.click(mediaArea);

      // Verify go to sub-page option is present
      expect(screen.getByText('Go to Sub-page')).toBeInTheDocument();
    });

    it('navigates to sub-page when go to sub-page option is selected in edit mode', async () => {
      const buttonWithSubPage = {
        ...mockButton,
        subPageId: 'sub-page-1',
      };

      render(
        <TestWrapper>
          <TestComponent button={buttonWithSubPage} pageId="main" />
        </TestWrapper>
      );

      // Enter edit mode
      const { toggleEditMode } = useApp();
      toggleEditMode();

      // Click the media area to open menu
      const mediaArea = screen.getByRole('button');
      fireEvent.click(mediaArea);

      // Click go to sub-page option
      fireEvent.click(screen.getByText('Go to Sub-page'));

      // Verify navigation to sub-page
      const { navigateToPage } = useApp();
      const navigateSpy = jest.spyOn({ navigateToPage }, 'navigateToPage');
      expect(navigateSpy).toHaveBeenCalledWith('sub-page-1');
    });
  });
}); 