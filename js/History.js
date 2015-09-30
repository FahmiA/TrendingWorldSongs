
var History = function() {
    this.reset();
};

History.prototype = {
    add: function(value) {
        // Remove all future values
        if(this.hasNext()) {
            this._values.splice(this._index, this._values.length - this._index);
        }

        this._values.push(value);
        this._index = this._values.length - 1;
    },

    getPrevious: function() {
        return this._values[--this._index];
    },

    getNext: function() {
        return this._values[++this._index];
    },

    hasPrevious: function() {
        return this._index > 0;
    },

    hasNext: function() {
        return this._index > -1 && this._index < this._values.length - 1;
    },

    removeLast: function() {
        this._values.pop();

        if(this._index >= this._values.length) {
            this._index = this._values.length - 1;
        }
    },

    reset: function() {
        this._values = [];
        this._index = -1;
    }
};
