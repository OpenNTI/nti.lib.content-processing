export default function parseRealPage(el) {
	return {
		type: 'realpagenumber',
		pageNumber: el.getAttribute('value'),
	};
}
