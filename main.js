// HYDROVIEWER PERU//

// PART 1: Define Map and also center around the contry of interest in this case PERU//

// a) Add the drainage layer
var map = L.map('map').setView([-9.046374, -77.042793], 6);
L.esri.basemapLayer('DarkGray').addTo(map);
var drainageWMSLayer;
var url ='https://tethys2.byu.edu/geoserver/peru_hydroviewer/wms'
drainageWMSLayer = L.tileLayer.betterWms(url, {
    layers: 'south_america-peru-drainage_line',
    format:'image/png',
    transparent: true
}).addTo(map);

//b)Add the ability to add forecast, historical, seasonal data related to the reach_id
var marker = null;
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  console.log(e);
  var target = $(e.target).attr("href") // activated tab
  // $(`${target}`).addClass('hidden');
  console.log(target);
  // alert(target);
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
map.on("click", function (event) {
    if (marker) {
      map.removeLayer(marker)
    }
    meta = drainageWMSLayer.GetFeatureInfo(event);
    reachid = meta[0];
    drain_area = meta[1];
    marker = L.marker(event.latlng).addTo(map);
    // marker.bindPopup(`<div id="forecast"></div>`);
    $("#obsgraph").modal('show');
    // $('#forecast-chart').addClass('hidden');
    // $('#historical-chart').addClass('hidden');
    // $('#seasonal-chart').addClass('hidden');
    // forecastShow(reachid);
    // historicalShow(reachid);
    // seasonalShow(reachid);
    FORECAST.graph_f(reachid,"forecast-chart",700,700);
    HISTORICAL.graph_h(reachid,"historical-chart",700,700);
    SEASONAL.graph_s(reachid,"seasonal-chart",700,700);
    // marker.openPopup()

    // $("#forecast-table").html('');
    // $("#chart_modal").modal('show');
});

// function forecastShow(reachid){
//   $('#forecast-chart').removeClass('hidden');
//   $('#historical-chart').addClass('hidden');
//   $('#seasonal-chart').addClass('hidden');
//
//   // $('#historical-chart').hide();
//   // $('#seasonal-chart').hide();
//   FORECAST.graph_f(reachid,"forecast-chart",700,700);
// }
// function historicalShow(reachid){
//   $('#historical-chart').removeClass('hidden');
//   $('#forecast-chart').addClass('hidden');
//   $('#seasonal-chart').addClass('hidden');
//   // $('#forecast-chart').hide();
//   // $('#seasonal-chart').hide();
//   HISTORICAL.graph_h(reachid,"historical-chart",700,700);
// }
// function seasonalShow(reachid){
//   $('#seasonal-chart').removeClass('hidden');
//   $('#forecast-chart').addClass('hidden');
//   $('#historical-chart').addClass('hidden');
//   // $('#forecast-chart').hide();
//   // $('#historical-chart').hide();
//   SEASONAL.graph_s(reachid,"seasonal-chart",700,700);
// }
