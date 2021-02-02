import {getService} from '@nti/web-client';

import DEFAULT_STRATEGIES from './dom-parsers';
import {parseHTML} from './parse-html';
import {parseWidgets} from './parse-widgets';

const MARKER_REGEX = /nti:widget-marker\[([^\]>]+)\]/i;
const WIDGET_MARKER_REGEX = /<!--(?:[^\]>]*)(nti:widget-marker\[(?:[^\]>]+)\])(?:[^\]>]*)-->/ig;

const DOCUMENT_NODE = 9;// Node.DOCUMENT_NODE

const arrayToObjectByKey = (array, key) => array.reduce((a, i) => (a[i[key]] = i, a), {});

/**
 * Take HTML content and parse it into parts that we can render widgets into it.
 *
 * @param {Object} packet     Should be and object with a property named 'content' that is a string.
 * @param {Object} strategies An object where the keys are the CSS selectors for widgets, and
 *                            the values are functions to transform that selected element into
 *                            an Object used to render the Widget.
 * @returns {Object} A packet of data, content, body, styles and widgets. MAY return a promise that fulfills with said object.
 */
export async function processContent (packet, strategies = DEFAULT_STRATEGIES) {
	const service = await getService();
	const doc = await parseHTML(packet.content);

	const body = doc.querySelector('body');
	const styles = Array.from(doc.querySelectorAll('link[rel=stylesheet]'))
		.map(i=>i.getAttribute('href'));

	const {widgets, parts} = buildContentBody(doc, service, strategies);

	return {
		...packet,
		contentRaw: packet.content,
		content: body.innerHTML,
		body: parts,
		styles,
		widgets
	};
}



export function buildContentBody (doc, service, strategies = DEFAULT_STRATEGIES) {
	const elementFactory = doc.nodeType === DOCUMENT_NODE ? doc : document;
	const body = doc.querySelector('body');

	const widgets = arrayToObjectByKey(parseWidgets(strategies, doc, elementFactory, service), 'guid');

	const parts = body.innerHTML.split(WIDGET_MARKER_REGEX).map(part => {
		let m = part.match(MARKER_REGEX);
		if (m && m[1]) {
			return widgets[m[1]];
		}
		return part;
	});

	return {
		widgets,
		parts
	};
}
