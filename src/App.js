import React, { useState } from 'react';
import Map from './Map';
import Sidebar from './Sidebar';

import './App.css';

export default function App() {
  const [selected, setSelected] = useState(new Set(['72']));

  const handleTripChange = e => {
    if (e.target.checked) {
      selected.add(e.target.name);
    } else {
      selected.delete(e.target.name);
    }

    setSelected(selected);
  };

  return (
    <div className="App">
      <div className="App-sidebar">
        <Sidebar selected={selected} onChange={handleTripChange} />
      </div>
      <div className="App-main">
        <Map files={selected} />
      </div>
    </div>
  );
}
