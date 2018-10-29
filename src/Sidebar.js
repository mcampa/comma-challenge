import React, { Component } from 'react';
import { fileList } from './fileList';

import './Sidebar.css';

export default class Sidebar extends Component {
  state = {};

  render() {
    return (
      <div className="Sidebar">
        <h1 className="Sidebar-title">comma.ai trips</h1>

        <div className="Sidebar-fileList">
          {fileList.map(name => (
            <div key={name}>
              <label className="Sidebar-fileItem">
                <input
                  name={`${name}`}
                  type="checkbox"
                  onChange={this.props.onChange}
                  checked={this.props.selected.has(name)}
                />
                {` ${name}.json`}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
