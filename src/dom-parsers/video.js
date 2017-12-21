import {Models} from 'nti-lib-interfaces';
import {getServer} from 'nti-web-client';

import parseDomObject from './object';


const SOURCE_QS = 'object[type$=videosource]';
const VIDEO_QS = 'object.naqvideo, object.ntivideo';

export function fixType (o) {
	o.MimeType = o.MimeType || o.type;
	o.NTIID = o.ntiid || (o.dataset || {}).ntiid;
	delete o.children;
	// delete o.ntiid;

	for (let key of ['height', 'width']) {
		if (key in o) {
			o[key] = parseInt(o[key], 10) || null;
		}
	}

	return o;
}

export function getVideosFromDom (contentElement) {
	const videoObjects = [];


	if (contentElement) {
		Array.from(contentElement.querySelectorAll(VIDEO_QS)).forEach(v =>
			videoObjects.push(parseVideo(v)));
	}

	return videoObjects;
}


export default function parseVideo (contentElement) {
	const o = fixType(parseDomObject(contentElement));

	o.sources = Array.from(contentElement.querySelectorAll(SOURCE_QS))
		.map(s => fixType(parseDomObject(s)));

	return new Models.media.Video(getServer(), null, o);
}
