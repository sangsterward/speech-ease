export interface ButtonData {
  id: string;
  text: string;
  imageUrl?: string;
  iconName?: string;
  subPageId?: string;
}

export interface Page {
  id: string;
  name: string;
  buttons: ButtonData[];
  parentPageId?: string;
}

export interface AppSettings {
  title: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  gridSize: {
    rows: number;
    columns: number;
  };
}

export interface AppState {
  settings: AppSettings;
  currentPageId: string;
  pages: Page[];
  isEditMode: boolean;
}

export interface AppContextType {
  state: AppState;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleEditMode: () => void;
  navigateToPage: (pageId: string) => void;
  addSubPage: (parentPageId: string, name: string) => void;
  updateButton: (pageId: string, buttonId: string, updates: Partial<ButtonData>) => void;
  updatePage: (pageId: string, buttons: ButtonData[]) => void;
  resetToDefault: () => void;
} 