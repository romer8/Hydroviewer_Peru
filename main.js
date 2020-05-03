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
    $('#forecast-chart').addClass('hidden');
    $('#historical-chart').addClass('hidden');
    $('#seasonal-chart').addClass('hidden');
    FORECAST.graph_f(reachid,"forecast-chart",700,700);
    HISTORICAL.graph_h(reachid,"historical-chart");
    SEASONAL.graph_s(reachid,"seasonal-chart");
    // marker.openPopup()

    // $("#forecast-table").html('');
    // $("#chart_modal").modal('show');
});
