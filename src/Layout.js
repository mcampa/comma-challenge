import React, { Component } from 'react';
import Map from './Map';
import Sidebar from './Sidebar';

import './Layout.css';

export default class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <div className="Layout-sidebar">
          <Sidebar />
        </div>
        <div className="Layout-main">
          <Map />
        </div>
      </div>
    );
  }
}
