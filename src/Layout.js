import React, { Component } from 'react';
import Map from './Map';

import './Layout.css';

export default class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <div className="Layout-sidebar">
          <h1>Comma.ai trips</h1>
        </div>
        <div className="Layout-main">
          <Map />
        </div>
      </div>
    );
  }
}
