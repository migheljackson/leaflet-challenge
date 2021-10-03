var quake_json = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

var tile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
                        {
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [
    8.059230, -27.374223
  ],
  zoom: 2

});

tile.addTo(myMap);



d3.json(quake_json).then(function(data) {
    
    function markerSize(magnitude) {
        return magnitude;
      }

  function markerColor(depth) {
    switch (true) {
        case depth > 80:
        return "green";
    case depth > 40:
        return "lightgreen";
      case depth > 20:
        return "yellow";
      case depth > 10:
        return "orange";
      case depth > 5:
        return "orangered";
      case depth > 0:
        return "red";
      default:
        return "white";
    }
  }


  

  function attributes(feature) {
    return {
      opacity: 0.75,
      fillOpacity: 0.75,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: attributes,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag 
                    + "<br>Depth: " + feature.geometry.coordinates[2]
                    + "<br>Location: " + feature.properties.place);

    }
  }).addTo(myMap);
  
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [0, 5, 10, 20, 40, 80];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i =0; i < depth.length; i++) {
      div.innerHTML +=
      '<div style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);


});

