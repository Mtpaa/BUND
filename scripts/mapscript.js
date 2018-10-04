
// map
var map = L.map('map').setView([51.069537, 13.252516], 7);
// OSM-Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend//Legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info'),
    grades = ['pestizidfrei', 'teilweise pestizidfrei'],// "k.A."],
    labels = ["./legend/green.PNG","./legend/orange.PNG"];//, "./legend/red.PNG", "./legend/white.PNG"];
    div.innerHTML = '<h4>Legende</h4>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          (" <img src="+ labels[i] +" height='25' width='20'>")+" "+grades [i] +'<br>';
    }

    return div;
};

legend.addTo(map);









//Sidebar
  var sidebar = L.control.sidebar('sidebar', {
           autoPan: true,
           closeButton: true,
           position: 'left'
       });
      sidebar.addTo(map);

//sidebar visible on startup
/*
       setTimeout(function () {
    sidebar.show();
 }, 500);
*/
  map.on('click', function () {
      sidebar.hide();
  })
  sidebar.on('show', function () {
      console.log('Sidebar will be visible.');
  });
  sidebar.on('shown', function () {
      console.log('Sidebar is visible.');
  });
  sidebar.on('hide', function () {
      console.log('Sidebar will be hidden.');
  });
  sidebar.on('hidden', function () {
      console.log('Sidebar is hidden.');
  });
  L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
      console.log('Close button clicked.');
  });


var markers = L.markerClusterGroup();
var searchLayer = L.layerGroup().addTo(map);
var legend = L.control({position: 'bottomright'});



function dataForMap(data, map){

      var layer1 = new L.LayerGroup();
      var marker;
      var markergreen = L.ExtraMarkers.icon({icon: 'fa-coffee', markerColor: 'green', shape: 'circle', prefix: 'fa'});
      var markerorange = L.ExtraMarkers.icon({icon: 'fa-coffee', markerColor: 'orange', shape: 'circle', prefix: 'fa'});
    //  var markerred = L.ExtraMarkers.icon({icon: 'fa-coffee', markerColor: 'red', shape: 'circle', prefix: 'fa'});
    //  var iconX = L.ExtraMarkers.icon({icon: 'fa-coffee', markerColor: 'white', shape: 'circle', prefix: 'fa'});
    //--> marker


    for (var i = 0; i <data.features.length; i++){
      //console.log(data);
        var myIcon;
        var myclass = data.features[i].properties.classification;
        var headline = data.features[i].properties.headline;
        var text = data.features[i].properties.text;
        var xy = data.features[i].geometry.coordinates;
        var x_point;
        var y_point;
                    xy = xy.toString();
                    xy = xy.split(",");
                    y_point = xy[1];
                    x_point = xy[0];

         if (myclass == 1){
              myIcon = markergreen;
          }
          else if (myclass == 2){
              myIcon = markerorange;
          }
          else if (myclass == 3){
            //  myIcon = markerred;
          }else {
            //  myIcon = iconX;
          }

  var coordsMarker = new L.LatLng(y_point, x_point);
      marker = new L.Marker([y_point, x_point],{icon: myIcon},{title:headline});

    var feature = marker.feature = marker.feature || {};
      feature.type = "Feature";
      feature.properties = feature.properties || {};
      feature.properties["title"] = data.features[i].properties.headline;
      feature.properties["text"] = data.features[i].properties.text;


      marker.addTo(layer1);

  } //ende for-schleife

  layer1.addTo(markers);
  map.addLayer(markers);
  //map.fitBounds(markers.getBounds());



  //markerclick change content sidebar
  markers.on('click', function (a) {
    console.log('markersclick');
    markers.bindPopup(a.layer.feature.properties.title);
	   //console.log(a.layer);
     sidebar.hide();
     sidebar.toggle();
     sidebar.setContent("<b>"+a.layer.feature.properties.title+"</b>"+"<br><br>"+a.layer.feature.properties.text);
     sidebar.show();
     map.setView(a.latlng,11);
   });




  //searchControl
  var searchControl = new L.Control.Search({
      position:'topleft',
      layer:markers, //  layer:layer1,
      propertyName:"title"
    });

  //searchLocationfound update Sidebar
  searchControl.on('search:locationfound',function(a){
    //console.log('search:locationfound');
    sidebar.hide();
    sidebar.toggle();
    sidebar.setContent("<b>"+a.layer.feature.properties.title+"</b>"+"<br><br>"+a.layer.feature.properties.text);
    sidebar.show();
     map.setView(a.latlng,11);
    }
  );

  map.addControl(searchControl);

}//End-Function dataformap



// Ajax call geojson-file
$.getJSON("./map.geojson", function(data) {
dataForMap(data, map);
});
