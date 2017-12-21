import {getService} from 'nti-web-client';
import {replaceNode, parent} from 'nti-lib-dom';
import uuid from 'uuid';

import DEFAULT_STRATEGIES from './dom-parsers';

const MARKER_REGEX = /nti:widget-marker\[([^\]>]+)\]/i;
const WIDGET_MARKER_REGEX = /<!--(?:[^\]>]*)(nti:widget-marker\[(?:[^\]>]+)\])(?:[^\]>]*)-->/ig;

const PARSE_TIMEOUT = 30 * 1000;//30 seconds. (in milliseconds)
const DOCUMENT_NODE = 9;// Node.DOCUMENT_NODE

const isReady = doc => doc.readyState !== 'loading';
const sleep = t => new Promise(x => setTimeout(x, t));

const indexArrayByKey = (array, key) => array.reduce((a, i) => (a[i[key]] = i, a), {});

export function getContent (raw) {
	const start = /<(!DOCTYPE|html)/i.exec(raw);
	//Some content pages have invalid text before the beginning of the document. This will strip it.
	return (start && start.index > 0)
		? raw.substr(start.index) : raw;
}


export async function parseHTML (htmlString) {
	const html = getContent(htmlString);
	const parser = (typeof DOMParser !== 'undefined') && new DOMParser();

	let doc = parser && (
		parser.parseFromString(html, 'text/html')
		// ||
		// parser.parseFromString(html, 'text/xml')
	);

	if (!doc) {
		doc = document.createElement('html');
		doc.innerHTML = html;
		doc.createComment = (...args) => document.createComment(...args);
	}

	if (!('readyState' in doc)) {
		doc.readyState = 'interactive';
	}

	const start = Date.now();
	while (!isReady(doc)) {
		await sleep(100);

		if ((Date.now() - start) > PARSE_TIMEOUT) {
			throw new Error('Parse Timeout');
		}
	}

	return doc;
}


/**
 * Take HTML content and parse it into parts that we can render widgets into it.
 *
 * @param {Object} packet     Should be and object with a property named 'content' that is a string.
 * @param {Object} strategies An object where the keys are the CSS selectors for widgets, and
 *                            the values are functions to transform that selected element into
 *                            an Object used to render the Widget.
 * @returns {object} A packet of data, content, body, styles and widgets. MAY return a promise that fulfills with said object.
 */
export async function processContent (packet, strategies = DEFAULT_STRATEGIES) {
	const service = await getService();
	const doc = await parseHTML(packet.content);

	const elementFactory = doc.nodeType === DOCUMENT_NODE ? doc : document;
	const body = doc.querySelector('body');
	const styles = Array.from(doc.querySelectorAll('link[rel=stylesheet]'))
		.map(i=>i.getAttribute('href'));

	const widgets = indexArrayByKey(parseWidgets(strategies, doc, elementFactory, service), 'guid');

	let bodyParts = body.innerHTML.split(WIDGET_MARKER_REGEX).map(part => {
		let m = part.match(MARKER_REGEX);
		if (m && m[1]) {
			return widgets[m[1]];
		}
		return part;
	});

	return Object.assign({}, packet, {
		content: body.innerHTML,
		body: bodyParts,
		styles: styles,
		widgets: widgets
	});
}


/**
 * @param {Object} strategies		An object where the keys are the CSS selectors for widgets, and
 *                             		the values are functions to transform that selected element into
 *                             		an Object used to render the Widget.
 *
 * @param {Document} doc			The content to search.
 *
 * @param {Node} elementFactory		A Dom object that has an implementation for 'createComment'.
 * @param {ServiceDocument} service	The Service document for your session.
 * @returns {object[]} An array of objects representing widgets.
 */
export function parseWidgets (strategies, doc, elementFactory, service) {

	function makeMarker (id) {
		return elementFactory.createComment('nti:widget-marker[' + id + ']');
	}

	function flatten (list, array) {
		if (!Array.isArray(array)) {
			array = [array];
		}

		list.push(...array);

		return list;
	}

	let selectors = Object.keys(strategies);

	return selectors
		.map(selector=> Array.from(doc.querySelectorAll(selector))
			//do not process nested objects
			.filter(el => selectors.every(x=> !parent(el.parentNode, x)))
			.map(el => {

				let id = el.getAttribute('id');
				let result = strategies[selector](el, service) || {element: el};

				if (!id) {
					el.setAttribute('id', (id = uuid()));
				}

				replaceNode(el, makeMarker(id));

				result.guid = id;
				return result;
			}))
		.reduce(flatten, []);
}


/**
 * Filters out all TAGs except for the ones absolutely necessary to convey the content.
 *
 * @param {string} html The content to filter
 *
 * @return {string} Filtered HTML
 */
export function filterContent (html) {

	function allowedTags (match, tag) {
		return /^(p|u|b|i|br|span|div|strong|em)$/i.test(tag) ? match : '';
	}

	let out = html;

	for (let tag of ['head', 'object', 'script', 'iframe', 'frameset', 'frame']) {
		let re = new RegExp(`<${tag}[^>]*>(.|\\n)*?<\\/${tag}>\\s*`, 'gi');
		out = out.replace(re, '');
	}

	// strip CSS and reserved attributes
	out = out.replace(/\s*(class|id|name|style)=".*?"/ig, '');

	// strip all tags, except allowed
	out = out.replace(/<\/?([^/\s>]+)[^>]*?>\s*/gm, allowedTags);

	out = out.trim();

	const cleaner = document.createElement('div');
	cleaner.innerHTML = out;
	cleaner.normalize();

	return cleaner.innerHTML;
}


/**
 * Trims a HTML block into a snippet...
 *
 * @param {string} html content to reduce.
 * @param {number} max Max characters to allow.
 * @return {string} the snippet html.
 */
export function getHTMLSnippet (html, max) {
	const markup = /(<[^>]+>)/;
	let count = 0;

	html = html.split(markup).filter(x=> x.trim().length);

	function text (x) {
		if (count >= max) { return ''; }

		if ((x.length + count) >= max) {
			x = (x.substr(0, (max - count) - 3) + '...');
		}

		count += x.length;

		return x;
	}

	return html
		.reduce((out, line) => out + (markup.test(line) ? line : text(line)), '')
		.replace(/<([^\s>]+)[^>]*><\/\1>/g, '');//remove all empty nodes
}
