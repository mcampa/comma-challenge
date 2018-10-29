import React from 'react';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import LineString from 'ol/geom/LineString';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Stamen, Vector as VectorSource } from 'ol/source';
import Style from 'ol/style/Style';
import { getDistanceFromLatLonInKm, kphToColorStroke } from './helpers';
import { AppContext } from './context';

import './MapComponent.css';

class MapComponent extends React.Component {
  inputRef = React.createRef();

  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate() {
    this.loadData();
  }

  render() {
    return (
      <div className="MapComponent">
        <div className="MapComponent-container" ref={this.inputRef} />
      </div>
    );
  }

  initMap = () => {
    this.vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: 'toner-lite',
          }),
        }),
        vectorLayer,
      ],
      renderer: 'webgl',
      target: this.inputRef.current,
      controls: defaultControls({
        attributionOptions: {
          collapsible: false,
        },
      }),
      view: new View({ center: [0, 0], zoom: 2 }),
    });
  };

  loadData = () => {
    // Get a list of selected files where the data is available
    const selectedFiles = [...this.props.selectedFiles].filter(name => this.props.data.hasOwnProperty(name));

    // TODO(optimization): Instead of clearing the vector layer every time
    // we could remove the features that are unselected and add the new selected coordinate features
    this.vectorSource.clear();

    selectedFiles.forEach(name => {
      const coordinates = this.props.data[name];
      // Transfor coordinates to projection coordinates
      const lines = coordinates.map(([lng, lat]) => fromLonLat([lng, lat]));
      // Create a feature for every file of coordnates and style every segment by speed
      const feature = new Feature(new LineString(lines));
      feature.setStyle(this.styleFunction(feature));
      // add the new feature to the vector layer
      this.vectorSource.addFeature(feature);
    });

    if (selectedFiles.length > 0) {
      // Move the map view to fit all features (trips)
      this.map.getView().fit(this.vectorSource.getExtent(), {
        size: this.map.getSize(),
        maxZoom: 12,
      });
    }
  };

  styleFunction = feature => {
    const geometry = feature.getGeometry();
    const styles = [];

    // add a style color for every line segment
    geometry.forEachSegment((start, end) => {
      // Calculate the distance between the start and end point in kilometers
      // assuming that the data was sample at 1hz we get convert to KPH
      const speed = getDistanceFromLatLonInKm(toLonLat(start), toLonLat(end)) * 60 * 60;
      // Get the stroke color style by speed
      const colorStroke = kphToColorStroke(speed);

      styles.push(
        new Style({
          geometry: new LineString([start, end]),
          stroke: colorStroke,
        }),
      );
    });

    return styles;
  };
}

// TODO: Change this to use React hooks to make it more readable
export default props => (
  <AppContext.Consumer>
    {({ selectedFiles, data }) => <MapComponent {...props} selectedFiles={selectedFiles} data={data} />}
  </AppContext.Consumer>
);
