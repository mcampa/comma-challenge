import React, { Component } from 'react';
import { fileList } from './fileList';

import './Sidebar.css';

export default class Sidebar extends Component {
  render() {
    return (
      <div className="Sidebar">
        <h1>Comma.ai trips</h1>

        {fileList.map(n => (
          <div>{`${n}.json`}</div>
        ))}
      </div>
    );
  }
}
