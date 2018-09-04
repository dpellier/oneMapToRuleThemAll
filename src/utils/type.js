'use strict';

function isAString(something) {
    return typeof something === 'string';
}

function isAFunction(something) {
    return typeof something === 'function';
}

module.exports = {
    isAString: isAString,
    isAFunction: isAFunction
};
