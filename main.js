// HYDROVIEWER PERU//

// PART 1: USE OF THIRD PARTY LIBRARIES (LEAFLET)

//--A) CREATE AND CENTER THE MAP IN PERU, ADD A WMS LAYER
// USE OF LEAFLET //
var map = L.map('map').setView([-9.046374, -77.042793], 6);
L.esri.basemapLayer('DarkGray').addTo(map);
var drainageWMSLayer;
var url ='https://tethys2.byu.edu/geoserver/peru_hydroviewer/wms'
drainageWMSLayer = L.tileLayer.betterWms(url, {
    layers: 'south_america-peru-drainage_line',
    format:'image/png',
    transparent: true
}).addTo(map);

// PART 2: ADD A CLICK AND THIRD PARTY EVENT LISTENER TO THE MAP AND TABS RESPECTIVELY. IN ADDITION,
// MANAGING A DOM ELEMENT WITH JAVASCRIPT//

//--A) ADD THE ABILITY TO ADD A MODAL WITH FORECAST, HISTORICAL, SEASONAL DATA WITH A CLICK
// USE OF CLICK EVENTS //
var marker = null;
map.on("click", function (event) {
    meta = drainageWMSLayer.GetFeatureInfo(event);
    if(meta[0] !==null){
      if (marker) {
        map.removeLayer(marker)
      }
      console.log("AQUI PRINTING META");
      console.log(meta);
      reachid = meta[0];
      drain_area = meta[1];
      region = meta[2];
      marker = L.marker(event.latlng).addTo(map);

      $("#obsgraph").modal('show');
      FORECAST.graph_f(reachid,"forecast-chart",700,700);
      HISTORICAL.graph_h(reachid,"historical-chart",700,700);
      SEASONAL.graph_s(reachid,"seasonal-chart",700,700);
      // --C) MODIFY THE DOM USING JAVASCRIPT //
      var modalTitle = document.getElementById("titleOfModal");
      modalTitle.innerHTML = region;

    }

});
//--B) ADD THE ABILITY TO CHANGE CONTENT BETWEEN THE TABS OF THE MODAL
// USE OF CHANGE EVENTS USING A THIRD PARTY LIBRARY  //
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  console.log(e);
  var target = $(e.target).attr("href") // activated tab
  if(target!=="#forecast" && target !=="#historical"){
    console.log("show seasonal");
    $('#forecast-chart').hide();
    $('#historical-chart').hide();
    $('#seasonal-chart').show()
  }
  if(target!=="#historical" && target !=="#seasonal"){
    console.log("show forecast");
    $('#forecast-chart').show();
    $('#historical-chart').hide();
    $('#seasonal-chart').hide()
  }
  if(target!=="#forecast" && target !=="#seasonal"){
    console.log("show historical");
    $('#forecast-chart').hide();
    $('#historical-chart').show();
    $('#seasonal-chart').hide()
  }
});
