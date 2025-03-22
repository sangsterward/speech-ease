import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';

const TestComponent: React.FC = () => {
  const { state, updateSettings, updatePage, navigateToPage, toggleEditMode, addSubPage, updateButton } = useApp();
  
  return (
    <div>
      <div data-testid="state">{JSON.stringify(state)}</div>
      <button onClick={() => updateSettings({ title: 'New Title' })}>Update Title</button>
      <button onClick={() => toggleEditMode()}>Toggle Edit</button>
      <button onClick={() => navigateToPage('page-1')}>Navigate</button>
      <button onClick={() => addSubPage('main', 'Sub Page')}>Add Sub Page</button>
      <button onClick={() => updateButton('main', '1', { text: 'Updated' })}>Update Button</button>
      <button onClick={() => updatePage('main', [{ id: '1', text: 'New Button' }])}>Update Page</button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('provides initial state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    expect(state.settings.title).toBe('SpeechEase');
    expect(state.currentPageId).toBe('main');
    expect(state.isEditMode).toBe(false);
  });

  it('updates settings', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Update Title').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    expect(state.settings.title).toBe('New Title');
  });

  it('toggles edit mode', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Toggle Edit').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    expect(state.isEditMode).toBe(true);
  });

  it('navigates to different pages', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Navigate').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    expect(state.currentPageId).toBe('page-1');
  });

  it('adds sub-pages', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Add Sub Page').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    const subPage = state.pages.find((p: any) => p.parentPageId === 'main');
    expect(subPage).toBeTruthy();
    expect(subPage.name).toBe('Sub Page');
    expect(subPage.buttons).toEqual([]);
  });

  it('updates buttons', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Update Button').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    const mainPage = state.pages.find((p: any) => p.id === 'main');
    const updatedButton = mainPage.buttons.find((b: any) => b.id === '1');
    expect(updatedButton?.text).toBe('Updated');
  });

  it('updates entire pages', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Update Page').click();
    });

    const state = JSON.parse(screen.getByTestId('state').textContent || '');
    const mainPage = state.pages.find((p: any) => p.id === 'main');
    expect(mainPage.buttons).toEqual([{ id: '1', text: 'New Button' }]);
  });

  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useApp must be used within an AppProvider');
    
    consoleError.mockRestore();
  });
}); 