import parseDomObject from './object';
import {getVideosFromDom} from './video';

export default function parseElement (el) {
	const data = parseDomObject(el);

	data.videos = getVideosFromDom(el);

	const types = new Set([...data.videos.map(x => x.type)]);

	data.children = data.children.filter(x => !types.has(x.type));

	return data;
}
