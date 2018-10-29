import React, { useState, useEffect } from 'react';

const INITIAL_SELECTED_FILES = ['72'];

export const AppContext = React.createContext();

// Instead of using Redux I wanted to use React Context and Hooks to learn about them
// This is where all app state is stored
export function AppProvider({ children }) {
  const [data, setData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(new Set(INITIAL_SELECTED_FILES));

  async function loadSelectedFilesData() {
    const promises = [...selectedFiles].map(async name => {
      if (!data[name]) {
        data[name] = await loadFileData(name);
      }
    });

    await Promise.all(promises);
    setData({ ...data });
  }

  useEffect(
    () => {
      loadSelectedFilesData();
    },
    // Only update when selectedFiles changes
    [selectedFiles],
  );

  const context = {
    data,
    selectedFiles,
    setSelectedFiles,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

async function loadFileData(name) {
  const response = await fetch(`/api/data/${name}`).then(res => res.json());
  // transform data into arrays. This could be done server side to improve response time
  return response.map(({ lng, lat }) => [lng, lat]);
}
