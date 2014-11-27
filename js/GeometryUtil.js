
var GeometryUtil = function() {
};

/** Utility class for working with GeoJSON geometry data.
 *
 * GeoJSON specification: http://geojson.org/geojson-spec.html
 */
GeometryUtil.prototype = {
    getCountryBounds: function(countryData) {
        if(countryData.geometry.type === 'Polygon') {
            return this._getBoundsPolygonType(countryData.geometry.coordinates);
        }else if(countryData.geometry.type === 'MultiPolygon') {
            return this._getBoundsMultiPolygonType(countryData.geometry.coordinates);
        }else{
            throw new Error('Unfortunatly, trending songs cannot be laoded for ' + countryData.properties.name +
                            '. Geometry type of ' + countryData.geometry.type + ' is not supported.');
        }

    },

    _getBoundsPolygonType: function(coordinates) {
        var result = this._buildResultObject();

        // Iterate over polygons
        for(var i = 0; i < coordinates.length; i++) {
            var polygon = coordinates[i];

            // Iterate over points
            for(var j = 0; j < polygon.length; j++) {
                var point = polygon[j];

                result.minLongitude = Math.min(result.minLongitude, point[0]);
                result.maxLongitude = Math.max(result.maxLongitude, point[0]);
                result.minLatitude = Math.min(result.minLatitude, point[1]);
                result.maxLatitude = Math.max(result.maxLatitude, point[1]);
            }
        }

        return result;
    },

    _getBoundsMultiPolygonType: function(coordinates) {
        var result = this._buildResultObject();

        // Iterate over multi-polygons (like the north and south islands of New Zealand)
        for(var i = 0; i < coordinates.length; i++) {
            var multiPolygon = coordinates[i];

            // Iterate over polygons
            for(var j = 0; j < multiPolygon.length; j++) {
                var polygon = multiPolygon[j];

                // Iterate over points
                for(var k = 0; k < polygon.length; k++) {
                    var point = polygon[k];

                    result.minLongitude = Math.min(result.minLongitude, point[0]);
                    result.maxLongitude = Math.max(result.maxLongitude, point[0]);
                    result.minLatitude = Math.min(result.minLatitude, point[1]);
                    result.maxLatitude = Math.max(result.maxLatitude, point[1]);
                }
            }
        }

        return result;
    },

    _buildResultObject: function() {
        // Latitude ranges from -90.0 to 90.0
        // Longitude ranges from -180.0 to 180.0
        return {
            minLatitude: 90.0,
            maxLatitude: -90.0,
            minLongitude: 180.0,
            maxLongitude: -180.0
        };
    }
};
