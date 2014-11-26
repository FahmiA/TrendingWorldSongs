
var GeometryUtil = function() {
};

GeometryUtil.prototype = {
    getCountryBounds: function(countryData) {
        if(countryData.geometry.type === 'Polygon') {
            return this._getBoundsPolygonType(countryData.geometry.coordinates);
        }else if(countryData.geometry.type === 'MultiPolygon') {
            return this._getBoundsMultiPolygonType(countryData.geometry.coordinates);
        }
    },

    _getBoundsPolygonType: function(coordinates) {
    },

    _getBoundsMultiPolygonType: function(coordinates) {
    }
};
