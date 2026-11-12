import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './i18n';
import { PreferencesProvider } from './preferences';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </LanguageProvider>
  </StrictMode>
);
