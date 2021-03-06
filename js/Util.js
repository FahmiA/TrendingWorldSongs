
var ArrayUtil = {
    flatten: function(array2D) {
        return [].concat.apply([], array2D);
    }
};

var StringUtil = {
    capitalize: function(value) {
        return value.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
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

var DOMUtil = {
    debounce: function(fn, delay) {
        // http://codereview.stackexchange.com/questions/58406/function-buffer-to-avoid-triggering-an-event-handler-too-frequently
        var timeout;

        return function () {
            var context = this,
                args = arguments;

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(context, args);
            }, delay || 250);
        };
    }
};
