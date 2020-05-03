L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);

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
      let region = null;

      if (url) {
          $.ajax({
              async: false,
              type: "GET",
              url: url,
              info_format: 'application/json',
              success: function (data) {
                  if(data['features'].length > 0){
                    reachid = data.features[0].properties['COMID'];
                    drain_area = data.features[0].properties['Tot_Drain_'];
                    region =  data.features[0].properties['region']
                  }
                  else{
                    console.log("Retriving data beyond the WMS layer is not posible");
                  }
              },
              error: function(e){
              }
          });
      }

      return [reachid, drain_area,region]


  },

});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};
