import { getContent } from './get-content';

const PARSE_TIMEOUT = 30 * 1000; //30 seconds. (in milliseconds)

const isReady = doc => doc.readyState !== 'loading';
const sleep = t => new Promise(x => setTimeout(x, t));

export async function parseHTML(htmlString) {
	const html = getContent(htmlString);
	const parser = typeof DOMParser !== 'undefined' && new DOMParser();

	let doc =
		parser &&
		parser.parseFromString(html, 'text/html');
		// ||
		// parser.parseFromString(html, 'text/xml')

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

		if (Date.now() - start > PARSE_TIMEOUT) {
			throw new Error('Parse Timeout');
		}
	}

	return doc;
}
