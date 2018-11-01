import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import { AppProvider } from './context';
import classnames from 'classnames';
import SidebarOpener from './SidebarOpener';
import './App.css';

export default function App() {
  const [open, setOpen] = useState(true);
  return (
    <AppProvider>
      <div className="App">
        <div className={classnames('App-sidebar', open && 'open')}>
          <Sidebar />
          <SidebarOpener onClick={() => setOpen(!open)} />
        </div>
        <div className="App-main">
          <MapComponent />
        </div>
      </div>
    </AppProvider>
  );
}
