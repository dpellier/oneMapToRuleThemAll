'use strict';

function getCustomContent(content, point) {
    if (typeof content === 'function') {
        return content(point);
    }
    return content || '';
}

class Label extends google.maps.OverlayView {
    constructor(config, point, content) {
        super();
        this.setValues(config);
        this._customContent = getCustomContent(content, point);

        this._div = document.createElement('div');
        this.hide();
    }

    onAdd() {
        let pane = this.getPanes().floatPane;
        pane.appendChild(this._div);
    }

    onRemove() {
        this._div.parentNode.removeChild(this.div_);
    }

    draw() {
        this.show();
        this._div.innerHTML = this._customContent;
    }

    hide() {
        this._div.style.cssText = 'position: absolute; display: none';
    }

    show() {
        let projection = this.getProjection();
        let position = projection.fromLatLngToDivPixel(this.get('position'));

        this._div.style.left = position.x + 'px';
        this._div.style.top = position.y + 'px';
        this._div.style.display = 'block';
    }
}

module.exports = Label;
