import React from 'react';
import './SidebarOpener.css';

export default function SidebarOpener(props) {
  return (
    <div className="SidebarOpener" onClick={props.onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 24">
        <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
      </svg>
    </div>
  );
}