import {getModel} from 'nti-lib-interfaces';
import {getServer} from 'nti-web-client';

import parseDomObject from './object';


const Video = getModel('video');

const SOURCE_QS = 'object[type$=videosource]';
const VIDEO_QS = 'object.naqvideo, object.ntivideo';

function fixType (o) {
	o.MimeType = o.MimeType || o.type;
	//TODO: delete o.type;
}

export function getVideosFromDom (contentElement) {
	let videoObjects = [];


	if (contentElement) {
		Array.from(contentElement.querySelectorAll(VIDEO_QS)).forEach(v =>
			videoObjects.push(parseVideo(v)));
	}

	return videoObjects;
}


export default function parseVideo (contentElement) {
	let o = parseDomObject(contentElement),
		s = o.sources = [];

	fixType(o);
	o.ntiid = o.ntiid || (o.dataset || {}).ntiid;

	for (let source of Array.from(contentElement.querySelectorAll(SOURCE_QS))) {
		source = parseDomObject(source);
		fixType(source);
		s.push(source);
	}

	return new Video(getServer(), null, o);
}
