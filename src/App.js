import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import { AppProvider } from './context';
import classnames from 'classnames';
import SpeedCharts from './SpeedCharts';
import SidebarOpener from './SidebarOpener';
import './App.css';

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <AppProvider>
      <div className="App">
        <div className={classnames('App-sidebar', open && 'open')}>
          <Sidebar onSelect={() => setOpen(false)} />
          <SidebarOpener onClick={() => setOpen(!open)} />
        </div>
        <div className="App-main">
          <MapComponent />
          <SpeedCharts />
        </div>
      </div>
    </AppProvider>
  );
}
