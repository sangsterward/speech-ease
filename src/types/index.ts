export interface ButtonData {
  id: string;
  text: string;
  imageUrl?: string;
  subPageId?: string;
}

export interface SubPage {
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
  pages: SubPage[];
  currentPageId: string;
  isEditMode: boolean;
}

export interface AppContextType {
  state: AppState;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updatePage: (pageId: string, buttons: ButtonData[]) => void;
  navigateToPage: (pageId: string) => void;
  toggleEditMode: () => void;
  addSubPage: (parentPageId: string, name: string) => void;
  updateButton: (pageId: string, buttonId: string, data: Partial<ButtonData>) => void;
} 