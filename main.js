var map = L.map('map').setView([4.5709, -74.2973], 6);
L.esri.basemapLayer('DarkGray').addTo(map);
var drainageWMSLayer;
var url ='https://tethys2.byu.edu/geoserver/peru_hydroviewer/wms'
// drainageWMSLayer = L.tileLayer.betterWms('https://tethys.byu.edu/geoserver/colombia_hydroviewer/wms', {
drainageWMSLayer = L.tileLayer.betterWms(url, {
    layers: 'south_america-peru-drainage_line',
    format:'image/png',
    transparent: true
}).addTo(map);

//part 2

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
    FORECAST.graph_f(reachid,"forecast-chart");
    HISTORICAL.graph_h(reachid,"historical-chart");
    SEASONAL.graph_s(reachid,"seasonal-chart");
    // marker.openPopup()
    $("#obsgraph").modal('show');
    $('#forecast-chart').addClass('hidden');
    $('#historical-chart').addClass('hidden');
    // $("#forecast-table").html('');
    // $("#chart_modal").modal('show');
});
