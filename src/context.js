import React, { useState, useEffect } from 'react';

const INITIAL_SELECTED_FILES = ['72'];

export const AppContext = React.createContext();
const dataCache = {};

// Instead of using Redux I wanted to use React Context and Hooks to learn about them
// This is where all app state is stored
export function AppProvider({ children }) {
  const [data, setData] = useState({});
  const [selectedFile, setSelectedFile] = useState(INITIAL_SELECTED_FILES);

  async function loadSelectedFilesData() {
    if (!dataCache[selectedFile]) {
      dataCache[selectedFile] = await loadFileData(selectedFile);
    }
    setData(dataCache[selectedFile]);
  }

  useEffect(
    () => {
      loadSelectedFilesData();
    },
    // Only update when selectedFile changes
    [selectedFile],
  );

  const context = {
    data,
    selectedFile,
    setSelectedFile,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

async function loadFileData(name) {
  const response = await fetch(`/api/data/${name}`).then(res => res.json());
  // transform data into arrays. This could be done server side to improve response time
  return response.map(({ lng, lat }) => [lng, lat]);
}
