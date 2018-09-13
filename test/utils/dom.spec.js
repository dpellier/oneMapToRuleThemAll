const JSDOM = require('jsdom').JSDOM;
const jsDom = new JSDOM();
global.document = jsDom.window.document;
global.window = jsDom.window;

const dom = require('../../src/utils/dom');

test('extract text from text', ()=>{
    expect(dom.extractTextAndCssClasses('a content').textContent).toBe('a content');
});

test('extract no css class from text', () => {
    expect(dom.extractTextAndCssClasses('a content').classes).toEqual([]);
});

test('extract text from html', ()=>{
    expect(dom.extractTextAndCssClasses('<div>a content</div>').textContent).toBe('a content');
});

test('extract css class from fragment', ()=>{
    expect(dom.extractTextAndCssClasses('<div class="myClass"></div>').classes).toEqual(['myClass']);
});

test('extract css classes from fragment', ()=>{
    expect(dom.extractTextAndCssClasses('<div class="myClass myOtherClass"></div>').classes).toEqual(['myClass', 'myOtherClass']);
});

test('extract no css class from text', ()=>{
    expect(dom.extractTextAndCssClasses('a content').classes).toEqual([]);
});
