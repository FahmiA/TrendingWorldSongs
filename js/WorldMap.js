var WorldMap = function(svgDoc) {
    this._svgDoc = svgDoc;

    this._prevCountryElement = null;
};

WorldMap.prototype = {
    init: function() {
        var me = this;
        d3.select(this._svgDoc).select('#Countries').selectAll('g')
            .on('click', DOMUtil.debounce(function() {
                me._onCountryClick(this);
            }))
            .append('title')
            .text(function() {
                return me._getNiceCountryName(this.parentNode.id);
            });
    },

    _onCountryClick: function(countryElement) {
        var countryID = countryElement.id;

        if(this._prevCountryElement) {
            this._deselectCountry(this._prevCountryElement);
        }

        this._displayNote(countryElement);
        this._selectCountry(countryElement, countryID);
        this._prevCountryElement = countryElement;

        var niceCountryName = this._getNiceCountryName(countryID);
        this.trigger('select', niceCountryName);
    },

    _selectCountry: function(countryElement, countryID) {
        var countryName = this._getCountryName(countryID);
        var niceCountryName = this._getNiceCountryName(countryID);

        // Display the country as selected
        d3.select(countryElement)
            .classed('country-selected', true);

        // Hide all scribbles
        var scribbles = d3.select(this._svgDoc).select('#scribbles').selectAll('g');
        scribbles.classed('scribble-selected', false);

        var scribbleId = '#Scribble-' + countryName;
        var selectedScribble = d3.select(this._svgDoc).select('#scribbles').select(scribbleId);
        selectedScribble.classed('scribble-selected', true);
    },

    _deselectCountry: function(countryElement) {
        d3.select(countryElement)
            .classed('country-selected', false);
    },

    _displayNote: function(countryElement) {
        var note = document.getElementById('note');
        if(!note) {
            console.warn('Could not find note');
            return;
        }

        var box = countryElement.getBoundingClientRect();
        var noteHeight = 50;
        var noteWidth = 50;
        d3.select(note)
            .classed('hidden', false)
            .style('left', (box.left + (box.width / 2) -  (noteWidth / 2)) + 'px')
            .style('top', (box.top + (box.height / 2) -  (noteHeight / 2)) + 'px')
            .style('width', noteWidth + 'px')
            .style('height', noteHeight + 'px');
    },

    _getCountryName: function(countryID) {
        return countryID.replace(/^Country-/, '');
    },

    _getNiceCountryName: function(countryID) {
        var name = this._getCountryName(countryID)
                        .replace(/_/g, ' ')
                        .toLowerCase();

        name = StringUtil.capitalize(name);
        return name;
    }
};

MicroEvent.mixin(WorldMap.prototype);
