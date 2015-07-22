'use strict';

let objectAssign = require('object-assign');

class Label extends L.Icon {
    constructor(content, options) {
        super(options);

        this.content = content;
    }

    createIcon() {
        let label = document.createElement('div');
        let icon = super.createIcon();

        label.appendChild(icon);
        label.innerHTML += this.content || '';
        label.style.height = 0;

        return label;
    }
}

module.exports = Label;
