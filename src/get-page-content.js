import {processContent} from './process-content';

export function getPageContent (pageInfo) {
	return pageInfo.getContent()
		.then(content => ({pageInfo, content}))
		//get the html and split out some resource references to fetch.
		.then(processContent)
		//load css
		.then(fetchResources);
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
