import React from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import { AppProvider } from './context';

import './App.css';

export default function App() {
  return (
    <AppProvider>
      <div className="App">
        <div className="App-sidebar">
          <Sidebar />
        </div>
        <div className="App-main">
          <MapComponent />
        </div>
      </div>
    </AppProvider>
  );
}
