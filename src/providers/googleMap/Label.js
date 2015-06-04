'use strict';

module.exports = function(Proto) {
    // Define the overlay, derived from google.maps.OverlayView
    function Label(options, idx, events) {
        // Initialization
        this.setValues(options);
        this.idx = idx;
        this.events = events;

        // Label specific
        var span = this.span_ = document.createElement('div');
        // TODO
        span.className = 'lf-map__marker';
        span.style.cssText = 'position: relative;';
        span.style.cssText += ' top: -32px;';
        span.style.cssText += ' left: 0;';
        span.style.cssText += ' margin: 0;';

        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
    }

    Label.prototype = new Proto();

    // Implement onAdd
    Label.prototype.onAdd = function() {
        var pane = this.getPanes().overlayLayer;
        pane.appendChild(this.div_);

        // Ensures the label is redrawn if the text or position is changed.
        var me = this;
        this.listeners_ = [
            //google.maps.event.addListener(this, 'position_changed', function() {
            //    me.draw();
            //}),
            //google.maps.event.addListener(this, 'text_changed', function() {
            //    me.draw();
            //})
            this.events.addListener(this, 'position_changed', function() {
                me.draw();
            }),
            this.events.addListener(this, 'text_changed', function() {
                me.draw();
            })
        ];
    };

    // Implement onRemove
    Label.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);

        // Label is removed from the map, stop updating its position/text.
        for (var i = 0; i < this.listeners_.length; ++i) {
            //google.maps.event.removeListener(this.listeners_[i]);
            this.events.removeListener(this.listeners_[i]);
        }
    };

    // Implement draw
    Label.prototype.draw = function() {
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(this.get('position'));

        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        div.style.display = 'block';

        this.span_.innerHTML = this.idx || '';
    };

    return Label;
};
