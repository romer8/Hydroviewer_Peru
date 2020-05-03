L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    // map.on('click', this.GetFeatureInfo, this);
    // map.on('click', this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
  },
  GetFeatureInfo: function (evt) {
      // Construct a GetFeatureInfo request URL given a point
      let size = this._map.getSize();
      let params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          version: this.wmsParams.version,
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          info_format: 'application/json',
          buffer: 18,
      };
      params[params.version === '1.3.0' ? 'i' : 'x'] = evt.containerPoint.x;
      params[params.version === '1.3.0' ? 'j' : 'y'] = evt.containerPoint.y;

      let url = this._url + L.Util.getParamString(params, this._url, true);
      let reachid = null;
      let drain_area = null;

      if (url) {
          $.ajax({
              async: false,
              type: "GET",
              url: url,
              info_format: 'application/json',
              success: function (data) {
                  console.log(data.features[0].properties);
                  reachid = data.features[0].properties['COMID'];
                  drain_area = data.features[0].properties['Tot_Drain_'];
                  console.log(reachid);
                  // L.popup({ maxWidth: 800}).setContent('hola').openOn(this._map);

                  // FORECAST.graph_f(reachid,"forecast");
              }
          });
      }
      // L.popup({ maxWidth: 800}).setContent('<div id="forecast"><div>').openOn(this._map);

      return [reachid, drain_area]


  },
  getFeatureInfo: function (evt) {
     // Make an AJAX request to the server and hope for the best
     var url = this.getFeatureInfoUrl(evt.latlng),
         showResults = L.Util.bind(this.showGetFeatureInfo, this);
     $.ajax({
       url: url,
       success: function (data, status, xhr) {
         var err = typeof data === 'string' ? null : data;
         showResults(err, evt.latlng, data);
       },
       error: function (xhr, status, error) {
         showResults(error);
       }
     });
   },

   getFeatureInfoUrl: function (latlng) {
     // Construct a GetFeatureInfo request URL given a point
     var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
         size = this._map.getSize(),

         params = {
           request: 'GetFeatureInfo',
           service: 'WMS',
           srs: 'EPSG:4326',
           styles: this.wmsParams.styles,
           transparent: this.wmsParams.transparent,
           version: this.wmsParams.version,
           format: this.wmsParams.format,
           bbox: this._map.getBounds().toBBoxString(),
           height: size.y,
           width: size.x,
           layers: this.wmsParams.layers,
           query_layers: this.wmsParams.layers,
           info_format: 'text/html'
         };

     params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
     params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

     return this._url + L.Util.getParamString(params, this._url, true);
   },

   showGetFeatureInfo: function (err, latlng, content) {
     if (err) { console.log(err); return; } // do nothing if there's an error

     // Otherwise show the content in a popup, or something.
     L.popup({ maxWidth: 800})
       .setLatLng(latlng)
       .setContent(content)
       .openOn(this._map);
   }
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};
