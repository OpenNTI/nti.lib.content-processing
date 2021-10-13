/**
 * Filters out all TAGs except for the ones absolutely necessary to convey the content.
 *
 * @param {string} html The content to filter
 * @returns {string} Filtered HTML
 */
export function filterContent(html) {
	function allowedTags(match, tag) {
		return /^(p|u|b|i|br|span|div|strong|em)$/i.test(tag) ? match : '';
	}

	let out = html;

	for (let tag of [
		'head',
		'object',
		'script',
		'iframe',
		'frameset',
		'frame',
	]) {
		let re = new RegExp(`<${tag}[^>]*>(.|\\n)*?<\\/${tag}>\\s*`, 'gi');
		out = out.replace(re, '');
	}

	// strip CSS and reserved attributes
	out = out.replace(/\s*(class|id|name|style)=".*?"/gi, '');

	// strip all tags, except allowed
	out = out.replace(/<\/?([^/\s>]+)[^>]*?>\s*/gm, allowedTags);

	out = out.trim();

	const cleaner = document.createElement('div');
	cleaner.innerHTML = out;
	cleaner.normalize();

	return cleaner.innerHTML;
}
