
var SimpleURL = function(baseURL) {
    this.baseURL = baseURL;
    this.parameters = [];
};

SimpleURL.prototype = {

    addParameter: function(key, value) {
        this.parameters.push({
            key: key,
            value: value
        });

        return this;
    },

    encodeParameters: function() {
        var value = '';

        for(var i = 0; i < this.parameters.length; i++) {
            var parameter = this.parameters[i];
            var delimiter = (i === 0) ? '?' : '&';

            value += delimiter + parameter.key + '=' + parameter.value;
        }

        return value;
    },

    toString: function() {
        return this.baseURL + this.encodeParameters();
    }
};
