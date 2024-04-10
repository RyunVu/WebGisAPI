// ====================================== OVERLAYS ======================================

var mapView = new ol.View({
  center: ol.proj.fromLonLat([108.507234, 11.996331]),
  zoom: 7,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
  controls: [],
});

var noneTile = new ol.layer.Tile({
  title: "None",
  type: "base",
  visible: false,
});

var osmTile = new ol.layer.Tile({
  title: "Open States Map",
  type: "base",
  visible: true,
  source: new ol.source.OSM(),
});

var baseGroup = new ol.layer.Group({
  title: "Base Maps",
  layers: [osmTile, noneTile],
});

map.addLayer(baseGroup);

var LacDuongVectorSource = new ol.source.Vector();
fetch('http://localhost:5000/api/commune')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the fetched data to check its structure

    if (data && data.result && Array.isArray(data.result.items)) {
      // Filter out features with undefined geometry
      var features = data.result.items.filter(item => item.geometry).map(item => {
        var feature = new ol.Feature({
          geometry: new ol.format.WKT().readGeometry(item.geometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          }),
          name: item.name,
          description: item.description,
        });

        // Add a text style to display the name as a label
        var textStyle = new ol.style.Text({
          text: item.name,
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
          offsetY: -15, // Position the text above the point
        });

        var strokeStyle = new ol.style.Stroke({
          color: 'blue',
          width: 2,
        });

        var fillStyle = new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)', 
        });

        var hoverFillStyle = new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.5)',
        });

        feature.setStyle(new ol.style.Style({
          stroke: strokeStyle,
          fill: fillStyle,
          text: textStyle,
        }));

        var hoverInteraction = new ol.interaction.Select({
          condition: ol.events.condition.pointerMove,
          style: new ol.style.Style({
            stroke: strokeStyle,
            fill: hoverFillStyle,
            text: textStyle,
          }),
        });

        hoverInteraction.on('select', function (e) {
          if (e.selected.length > 0) {
            var selectedFeature = e.selected[0];
            var selectedName = selectedFeature.get('name');
            var selectedTextStyle = new ol.style.Text({
              text: selectedName,
              font: '12px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
              offsetY: -15, 
            });
            selectedFeature.setStyle(new ol.style.Style({
              stroke: strokeStyle,
              fill: hoverFillStyle,
              text: selectedTextStyle,
            }));
          }
        });

        hoverInteraction.on('deselect', function (e) {
          if (e.deselected.length > 0) {
            var deselectedFeature = e.deselected[0];
            deselectedFeature.setStyle(new ol.style.Style({
              stroke: strokeStyle,
              fill: fillStyle,
              text: textStyle,
            }));
          }
        });

        map.addInteraction(hoverInteraction);

        return feature;
      });

      // Set features to LacDuongVectorSource
      LacDuongVectorSource.addFeatures(features);

      var vectorLayer = new ol.layer.Vector({
        source: LacDuongVectorSource,
        title: 'Fetched Data', // Set a title for the layer
      });

      map.addLayer(vectorLayer);

      // Fit the map to the extent of the data
      map.getView().fit(LacDuongVectorSource.getExtent());
    } else {
      console.error('Error: Unexpected data structure');
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

 // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
 var mousePosition = new ol.control.MousePosition({
  className: "mousePosition",
  projection: "EPSG:4326",
  coordinateFormat: function (coordinate) {
    return ol.coordinate.format(coordinate, "{y}, {x}", 6);
  },
});

map.addControl(mousePosition);