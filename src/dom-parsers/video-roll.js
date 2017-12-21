import parseDomObject from './object';
import {getVideosFromDom, fixType} from './video';

export default function parseElement (el, service) {
	const data = fixType(parseDomObject(el, service));

	data.videos = getVideosFromDom(el, service);

	return data;
}
