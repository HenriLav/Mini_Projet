
const fs = require('fs-extra')
const _ = require('lodash');
const turf = require('@turf/turf');
const originalfile = fs.readFileSync('1999to2022.geojson');
const o = JSON.parse(originalfile);

const newFeatures = [];
for(let i = 0; i < o.features.length; i += 1) {
  const oldFeature = o.features[i];

  const featureSimplified = turf.simplify(oldFeature, { tolerance: 0.0001, highQuality: true }); 
  const featureTruncated = turf.truncate(featureSimplified,{precision:6} ); 

  const propertiesToKeep = ["mag", "place", "time"]
  featureTruncated.properties = _.pick(featureTruncated.properties, propertiesToKeep);
  
  newFeatures.push(featureTruncated);
}

const collection = turf.featureCollection(newFeatures);
fs.writeFileSync('1999to2022clean.geojson', JSON.stringify(collection, null, 2));

console.log('Newfile 1999to2022clean.geojson');