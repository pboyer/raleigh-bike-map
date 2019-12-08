const mapnik = require("mapnik");
const fs = require("fs");

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

const res = 7200;

const outputFilename = "dist/raleigh-bike-map-raw.png";

const map = new mapnik.Map(1.35 * res, res);
map.load("./raleigh.xml", function(err, map) {
  if (err) throw err;
  map.zoomAll();

  const im = new mapnik.Image(1.35 * res, res);

  map.render(im, function(err, im) {
    if (err) throw err;
    im.encode("png", function(err, buffer) {
      if (err) throw err;
      fs.writeFile(outputFilename, buffer, function(err) {
        if (err) throw err;
        console.log("saved map image to " + outputFilename);
      });
    });
  });
});
