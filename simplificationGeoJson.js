
const fs = require('fs-extra')
const _ = require('lodash');
const turf = require('@turf/turf');

function getJSONFromFile(file){
  var content = fs.readFileSync(file);
  return JSON.parse(content);
}

function simplifier(feature){
  return turf.simplify(feature, { tolerance: 0.0001, highQuality: true }); 
}

function truncate(feature){
  return turf.truncate(feature,{precision:6} );
}

function pick(properties, data){
  return _.pick(properties, data);
}

function addZeroToDate(int) {
  if (int < 10){
    return "0" + int;
  }
  return int;
}

function parseTimestampToString(timestamp) {
  var MONTH_NAME = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = MONTH_NAME[date.getMonth()];
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  month = addZeroToDate(month);
  day = addZeroToDate(day);
  hours = addZeroToDate(hours);
  minutes = addZeroToDate(minutes);
  seconds = addZeroToDate(seconds);

  var formatedTime = day + "/" + month + "/" + year + " " + hours + ':' + minutes + ':' + seconds;
  return formatedTime;
}

function clean(features) {
  var propertiesToKeep = ["mag", "place", "time"]
  features.forEach(function (feature, index) {
    feature = simplifier(feature);
    feature = truncate(feature);
    feature.properties = pick(feature.properties, propertiesToKeep);
    feature.properties.time = parseTimestampToString(feature.properties.time);
    features[index] = feature;
  })
  return features;
}

function toGeoJSON(data) {
  return turf.featureCollection(data);
}

function createFile(name, content){
  fs.writeFileSync(name, content);
  console.log('Nouveau Fichier 1999to2022clean.geojson');
}

var data = getJSONFromFile('1999to2022.geojson');
data.features = clean(data.features);
var geoJSON = toGeoJSON(data);
createFile('1999to2022clean.geojson', JSON.stringify(geoJSON, null, 2));


