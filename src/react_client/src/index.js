import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./components/layout/ThemeSwitcher.css";

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main application wrapped in BrowserRouter and React Strict Mode
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
