// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');
var emitter = require('events').EventEmitter;

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_API
});


function labelDetection(image_path) {
  var ret_labels = [];
  var e = new emitter();

  // Check if image exist
  fs.exists(image_path, function(exists) {
    if (exists) {
      // Performs label detection on the image file
      client
      .labelDetection(image_path)
      .then(results => {
        const labels = results[0].labelAnnotations;
        labels.forEach(label => ret_labels.push({description: label.description, score: label.score}));
        e.emit('done', ret_labels)
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    } else console.error('ERROR: File does not exist - ', image_path);
  });

  return e;
}

module.exports.labelDetection = labelDetection;