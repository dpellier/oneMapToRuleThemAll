let isAString = require("../../src/utils/type").isAString;
let isAFunction = require("../../src/utils/type").isAFunction;

test('is a string', () => {
    expect(isAString('aaa')).toBe(true);
});

test('is not a string', () => {
    expect(isAString({a: 'a'})).toBe(false);
});

test('is a function (arrow definition)', () => {
    const arrowFunction = (a) => a * a;
    expect(isAFunction(arrowFunction)).toBe(true);
});

test('is a function (classic definition)', () => {
    const classicFunction = function (a) {
        return a * a
    };
    expect(isAFunction(classicFunction)).toBe(true);
});

test('is not a function', () => {
    const notAFunction = 's string';
    expect(isAFunction(notAFunction)).toBe(false);
});
