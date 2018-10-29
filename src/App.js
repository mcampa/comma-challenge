import React, { Component } from 'react';
import Map from './Map';
import Sidebar from './Sidebar';

import './App.css';

export default class App extends Component {
  state = {
    selected: new Set(['72']),
  };

  render() {
    const { selected } = this.state;

    return (
      <div className="App">
        <div className="App-sidebar">
          <Sidebar selected={selected} onChange={this.handleTripChange} />
        </div>
        <div className="App-main">
          <Map files={selected} />
        </div>
      </div>
    );
  }

  handleTripChange = e => {
    const { selected } = this.state;

    if (e.target.checked) {
      selected.add(e.target.name);
    } else {
      selected.delete(e.target.name);
    }

    this.setState({ selected });
  };
}
