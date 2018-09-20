const JSDOM = require('jsdom').JSDOM;
const jsDom = new JSDOM();
global.document = jsDom.window.document;
global.window = jsDom.window;

const dom = require('../../src/utils/dom');

test('extract text from text', ()=>{
    expect(dom.extractTextAndCssClasses('a content').textContent).toBe('a content');
});

test('extract no css class from text', () => {
    expect(dom.extractTextAndCssClasses('a content').classes).toBeUndefined();
});

test('extract text from html', ()=>{
    expect(dom.extractTextAndCssClasses('<div>a content</div>').textContent).toBe('a content');
});

test('extract css class from fragment', ()=>{
    expect(dom.extractTextAndCssClasses('<div class="myClass"></div>').classes).toEqual('myClass');
});

test('extract css classes from fragment', ()=>{
    expect(dom.extractTextAndCssClasses('<div class="myClass myOtherClass"></div>').classes).toEqual('myClass myOtherClass');
});

test('extract no css class from text', ()=>{
    expect(dom.extractTextAndCssClasses('a content').classes).toBeUndefined();
});

test('extract no css class and no text from empty string', () => {
    const textAndCssClasses = dom.extractTextAndCssClasses('');
    expect(textAndCssClasses.textContent).toEqual('');
    expect(textAndCssClasses.classes).toEqual('');
});

test('extract style from css class', () => {
    // given a defined css class
    const style = document.createElement('style');
    style.type = 'text/css';
    const css = `.map-custom-label {
  top: 2px;
  left: 40px;
  width: 10px;
  height: 10px;
  color: red;
  position: absolute;
}`;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    expect(dom.getStyleFromCss('map-custom-label')).toEqual({left: 40, top: 2});
});
