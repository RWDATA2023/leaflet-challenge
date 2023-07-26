// Creating map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
}).addTo(myMap);

// Load in GeoJSON data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize function that will give each city a different radius based on its magnitude
function markerSize(magnitude) {
  return magnitude * 30000;
}

// Define function to set color of marker based on the depth of the earthquake
function chooseColor(depth) {
  switch (true) {
    case depth > 90:
      return "red";
    case depth > 70:
      return "orangered";
    case depth > 50:
      return "darkorange";
    case depth > 30:
      return "orange";
    case depth > 10:
      return "gold";
    default:
      return "green";
  }
}

d3.json(geoData).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case an earthquake)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color the earthquake (color based on depth)
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        weight: 1.5,
        radius: markerSize(feature.properties.mag)
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a feature (earthquake) is clicked, it is enlarged on the map
        click: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature (earthquake), the feature reduces in size
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          });
        }
      });
      // Giving each feature a pop-up with information pertinent to the earthquake
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " 
      + feature.properties.mag + "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");

    },
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
        radius: markerSize(feature.properties.mag)
      });
    }
  }).addTo(myMap);
}).catch(function(error) {
  console.log(error);
});
