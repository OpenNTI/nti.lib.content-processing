export function getContent (raw) {
	const start = /<(!DOCTYPE|html)/i.exec(raw);
	//Some content pages have invalid text before the beginning of the document. This will strip it.
	return (start && start.index > 0)
		? raw.substr(start.index) : raw;
}
