
var ArrayUtil = {
    flatten: function(array2D) {
        return [].concat.apply([], array2D);
    }
};

var EchoNestUtil = {
    validateResponse: function(data, countryName) {
        var errorMessage = null;

        if(!data) {
            countryName = countryName || 'country';
            errorMessage = 'Could not retrieve trending songs from ' + countryName + '. Please try again later.';
        } else if(data.response.status.code === 3) {
            errorMessage = 'Woops. Looks like I\'ve hit my rate limit with the EchoNest. Please try agin is about a minute.';
        }

        return errorMessage;
    }
};
