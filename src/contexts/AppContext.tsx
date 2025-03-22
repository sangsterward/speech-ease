import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AppContextType, AppState, AppSettings, ButtonData } from '../types';

const STORAGE_KEY = 'speechease_state';

const defaultState: AppState = {
  settings: {
    title: 'SpeechEase',
    colorScheme: {
      primary: '#4F46E5',
      secondary: '#818CF8',
      background: '#F3F4F6',
      text: '#1F2937',
    },
    gridSize: {
      rows: 3,
      columns: 4,
    },
  },
  pages: [
    {
      id: 'main',
      name: 'Main',
      buttons: [],
    },
  ],
  currentPageId: 'main',
  isEditMode: false,
};

// Load state from localStorage
const loadInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return defaultState;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state]);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const updatePage = useCallback((pageId: string, buttons: ButtonData[]) => {
    dispatch({ type: 'UPDATE_PAGE', payload: { pageId, buttons } });
  }, []);

  const navigateToPage = useCallback((pageId: string) => {
    dispatch({ type: 'NAVIGATE_TO_PAGE', payload: pageId });
  }, []);

  const toggleEditMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  }, []);

  const addSubPage = useCallback((parentPageId: string, name: string) => {
    dispatch({ type: 'ADD_SUB_PAGE', payload: { parentPageId, name } });
  }, []);

  const updateButton = useCallback((pageId: string, buttonId: string, data: Partial<ButtonData>) => {
    dispatch({ type: 'UPDATE_BUTTON', payload: { pageId, buttonId, data } });
  }, []);

  // Add a reset function to clear local storage and reset to default state
  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_TO_DEFAULT', payload: defaultState });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        updateSettings,
        updatePage,
        navigateToPage,
        toggleEditMode,
        addSubPage,
        updateButton,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

type Action =
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_PAGE'; payload: { pageId: string; buttons: ButtonData[] } }
  | { type: 'NAVIGATE_TO_PAGE'; payload: string }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'ADD_SUB_PAGE'; payload: { parentPageId: string; name: string } }
  | { type: 'UPDATE_BUTTON'; payload: { pageId: string; buttonId: string; data: Partial<ButtonData> } }
  | { type: 'RESET_TO_DEFAULT'; payload: AppState };

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.payload.pageId
            ? { ...page, buttons: action.payload.buttons }
            : page
        ),
      };
    case 'NAVIGATE_TO_PAGE':
      return {
        ...state,
        currentPageId: action.payload,
      };
    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        isEditMode: !state.isEditMode,
      };
    case 'ADD_SUB_PAGE':
      const newPage = {
        id: `page-${Date.now()}`,
        name: action.payload.name,
        buttons: [],
        parentPageId: action.payload.parentPageId,
      };
      return {
        ...state,
        pages: [...state.pages, newPage],
      };
    case 'UPDATE_BUTTON':
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.payload.pageId
            ? {
                ...page,
                buttons: page.buttons.map((button) =>
                  button.id === action.payload.buttonId
                    ? { ...button, ...action.payload.data }
                    : button
                ),
              }
            : page
        ),
      };
    case 'RESET_TO_DEFAULT':
      return action.payload;
    default:
      return state;
  }
}; 