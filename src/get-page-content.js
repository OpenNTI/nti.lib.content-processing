import LRU from 'lru-cache';

import {processContent} from './process-content';

const cache = LRU({max: 100, maxAge: 30000 /*60 seconds*/});

export function getPageContent (pageInfo) {
	const key = pageInfo.getLink && pageInfo.getLink('content');

	const fetch = () => pageInfo.getContent()
		.then(content => ({pageInfo, content}))
		//get the html and split out some resource references to fetch.
		.then(processContent)
		//load css
		.then(fetchResources);


	if (!key) {
		return fetch();
	}

	let promise = cache.get(key);

	if (!promise) {
		cache.set(key, promise = fetch());
	}

	return promise;
}


function fetchResources (packet) {
	const {pageInfo: page, styles} = packet;
	const requests = styles.map(r => page.getResource(r));

	return Promise.all(requests)
		// .catch(reason=>{
		// 	logger.log(reason);
		// })
		.then(stylesheets => {
			packet.styles = stylesheets.map(css => css.replace(/#NTIContent/g, 'nti\\:content'));
			return packet;
		});
}
