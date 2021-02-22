/**
 * Trims a HTML block into a snippet...
 *
 * @param {string} html content to reduce.
 * @param {number} max Max characters to allow.
 * @returns {string} the snippet html.
 */
export function getHTMLSnippet(html, max) {
	const markup = /(<[^>]+>)/;
	let count = 0;

	html = html.split(markup).filter(x => x.trim().length);

	function text(x) {
		if (count >= max) {
			return '';
		}

		if (x.length + count >= max) {
			x = x.substr(0, max - count - 3) + '...';
		}

		count += x.length;

		return x;
	}

	return html
		.reduce(
			(out, line) => out + (markup.test(line) ? line : text(line)),
			''
		)
		.replace(/<([^\s>]+)[^>]*><\/\1>/g, ''); //remove all empty nodes
}
