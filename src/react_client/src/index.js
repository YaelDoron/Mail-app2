import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ← הוספת הייבוא

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ← לעטוף את כל האפליקציה */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
