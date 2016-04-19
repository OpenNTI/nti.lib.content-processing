import parseDomObject from '../object';
import {makeDOM} from './tools';

describe('DOM Parsers: DOM to Object Parser', () => {

	it ('Should interpret a DOM <object> into a JSON object', () => {
		const id = 'fancy-thing';
		const ntiid = 'tag:nextthought.com:test';
		const type = 'application/vnd.next....';
		const obj = makeDOM(`
			<object id="${id}" data-ntiid="${ntiid}" data-source="abc" type="${type}">
				<param name="foo" value="bar"></param>
				<param name="something" value="baz"></param>
				<p>hey every body!</p>
			</object>
		`);

		const json = parseDomObject(obj);

		expect(json).toEqual({
			id,
			type,
			foo: 'bar',
			something: 'baz',
			dataset: {
				ntiid,
				source: 'abc'
			}
		});


		expect(json.dom).toBeTruthy();
		expect(json.dom.nodeType).toBe(Node.ELEMENT_NODE);
		expect(json.dom).not.toBe(obj);
	});


	it ('Should work on any node', () => {
		const src = 'generic.png';
		const obj = makeDOM(`<img src="${src}" class="avatar" style="opacity: 0">`);

		const json = parseDomObject(obj);
		expect(json).toEqual({
			src,
			class: 'avatar', 
			style: 'opacity: 0'
		});

		expect(json.dom).toBeTruthy();
		expect(json.dom.nodeType).toBe(Node.ELEMENT_NODE);
		expect(json.dom).not.toBe(obj);
	});
});
