import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Context Providers
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './components/NotificationSystem';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
  <NotificationProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </NotificationProvider>
</HashRouter>
  </React.StrictMode>
);