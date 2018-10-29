import Stroke from 'ol/style/Stroke';

export function getDistanceFromLatLonInKm(coord1, coord2) {
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

// Color scale generated using https://gka.github.io/palettes/
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

// Return a color stroke style by speed in KPH
// where 0 KPH is red and 160+ KPH is lime
export function kphToColorStroke(kph) {
  const max = 160;
  const clampedSpeed = Math.max(0, Math.min(max, kph));
  const colorIndex = Math.floor((clampedSpeed * (colors.length - 1)) / max);
  return colorStrokes[colorIndex];
}
