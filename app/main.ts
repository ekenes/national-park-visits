import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

(async () => {

  const map = new WebMap({
    basemap: "streets"
  });

  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [ -118.244, 34.052],
    zoom: 12
  });

})();