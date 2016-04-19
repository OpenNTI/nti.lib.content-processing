export function makeDOM (html) {
	let d = document.createElement('div');
	d.innerHTML = html.trim();
	if (d.childNodes.length > 1) {
		throw new Error('Only one root node!');
	}
	return d.firstChild;
}
