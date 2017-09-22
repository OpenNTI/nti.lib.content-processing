import parseDomObject from './object';
import {getVideosFromDom, fixType} from './video';

export default function parseElement (el) {
	const data = fixType(parseDomObject(el));

	data.videos = getVideosFromDom(el);

	return data;
}
