import React, { useContext } from 'react';
import { fileList } from './fileList';
import { AppContext } from './context';
import './Sidebar.css';

export default function Sidebar(props) {
  const { selectedFile, setSelectedFile } = useContext(AppContext);

  const handleTripChange = e => {
    setSelectedFile(e.target.name);
    props.onSelect();
  };

  return (
    <div className="Sidebar">
      <h1 className="Sidebar-title">comma.ai trips</h1>
      <div className="Sidebar-fileList">
        {fileList.map(name => (
          <div key={name}>
            <label className="Sidebar-fileItem">
              <input name={`${name}`} type="radio" onChange={handleTripChange} checked={selectedFile === name} />
              {` ${name}.json`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
