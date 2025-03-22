import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { SpeechBar } from './components/SpeechBar/SpeechBar';
import { ButtonGrid } from './components/ButtonGrid/ButtonGrid';
import { Menu } from './components/Menu/Menu';
import { useApp } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const { settings } = state;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: settings.colorScheme.background,
        color: settings.colorScheme.text,
      }}
    >
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold">{settings.title}</h1>
        <Menu />
      </header>

      <main className="container mx-auto px-4">
        <SpeechBar />
        <ButtonGrid />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}; 