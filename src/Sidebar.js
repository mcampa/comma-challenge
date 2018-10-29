import React, { useContext } from 'react';
import { fileList } from './fileList';
import { AppContext } from './context';
import './Sidebar.css';

export default function Sidebar() {
  const { selectedFiles, setSelectedFiles } = useContext(AppContext);

  const handleTripChange = e => {
    if (e.target.checked) {
      selectedFiles.add(e.target.name);
    } else {
      selectedFiles.delete(e.target.name);
    }

    setSelectedFiles(new Set([...selectedFiles]));
  };

  return (
    <div className="Sidebar">
      <h1 className="Sidebar-title">comma.ai trips</h1>

      <div className="Sidebar-fileList">
        {fileList.map(name => (
          <div key={name}>
            <label className="Sidebar-fileItem">
              <input name={`${name}`} type="checkbox" onChange={handleTripChange} checked={selectedFiles.has(name)} />
              {` ${name}.json`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
