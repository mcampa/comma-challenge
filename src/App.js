import React, { Component } from 'react';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import LineString from 'ol/geom/LineString';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Stamen, Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';
import { fileList } from './fileList';

export default class App extends Component {
  inputRef = React.createRef();

  render() {
    return <div ref={this.inputRef} />;
  }

  componentDidMount() {
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
    });

    const map = new Map({
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

    fileList.slice(12, 15).forEach(async n => {
      const coordinates = (await this.loadData(n)).map(({ lng, lat }) => [lng, lat]);
      const lines = coordinates.map(([lng, lat]) => fromLonLat([lng, lat]));
      const feature = new Feature(new LineString(lines));
      feature.setStyle(this.styleFunction(feature));
      vectorSource.addFeature(feature);

      map.getView().fit(vectorSource.getExtent(), {
        size: map.getSize(),
        maxZoom: 12,
      });
    });
  }

  loadData = n => fetch(`api/data/${n}`).then(res => res.json());

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

// function averageGeolocation(coords) {
//   return [
//     coords.reduce((sum, [lng]) => sum + lng, 0) / coords.length,
//     coords.reduce((sum, [_, lat]) => sum + lat, 0) / coords.length,
//   ];
// }

function getDistanceFromLatLonInKm(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const colors = [
  '#ff0000',
  '#f64d00',
  '#eb6f00',
  '#df8900',
  '#d1a000',
  '#c0b500',
  '#abc900',
  '#90dc00',
  '#6aed00',
  '#00ff00',
];

const colorStrokes = colors.map(color => new Stroke({ color: color, width: 4 }));

function kphToColorStroke(kph) {
  const max = 160;
  const clampedSpeed = Math.max(0, Math.min(max, kph));
  const colorIndex = Math.floor((clampedSpeed * (colors.length - 1)) / max);
  return colorStrokes[colorIndex];
}
