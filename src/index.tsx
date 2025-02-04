import React from 'react';
import Home from './app/page';
import './index.css';

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);