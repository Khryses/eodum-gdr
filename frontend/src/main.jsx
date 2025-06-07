import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Context Providers
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './components/NotificationSystem';
import { DocumentationProvider } from './context/DocumentationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <UserProvider>
          <DocumentationProvider>
            <App />
          </DocumentationProvider>
        </UserProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);