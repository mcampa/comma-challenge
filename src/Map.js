import React, { Component } from 'react';
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

import './Map.css';

export default class MapComponent extends Component {
  inputRef = React.createRef();

  render() {
    return (
      <div className="Map">
        <div className="Map-container" ref={this.inputRef} />
      </div>
    );
  }

  componentDidMount() {
    this.initMap();
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  initMap() {
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
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }

  loadData = async () => {
    this.vectorSource.clear();
    const promises = [...this.props.files].map(async name => {
      const coordinates = (await this.loadFileData(name)).map(({ lng, lat }) => [lng, lat]);
      const lines = coordinates.map(([lng, lat]) => fromLonLat([lng, lat]));
      const feature = new Feature(new LineString(lines));
      feature.setStyle(this.styleFunction(feature));
      this.vectorSource.addFeature(feature);
    });

    await Promise.all(promises);

    this.map.getView().fit(this.vectorSource.getExtent(), {
      size: this.map.getSize(),
      maxZoom: 12,
    });
  };

  loadFileData = name => fetch(`api/data/${name}`).then(res => res.json());

  styleFunction = feature => {
    const geometry = feature.getGeometry();
    const styles = [];

    geometry.forEachSegment((start, end) => {
      const speed = getDistanceFromLatLonInKm(toLonLat(start), toLonLat(end)) * 60 * 60;
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
