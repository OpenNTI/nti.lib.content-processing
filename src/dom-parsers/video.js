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
	const o = parseDomObject(contentElement);
	const s = o.sources = [];

	o.children = o.children.filter(x => !/videosource$/i.test(x.type));

	fixType(o);
	o.ntiid = o.ntiid || (o.dataset || {}).ntiid;

	for (let source of Array.from(contentElement.querySelectorAll(SOURCE_QS))) {
		source = parseDomObject(source);
		fixType(source);

		source.height = parseInt(source.height, 10) || null;
		source.width = parseInt(source.width, 10) || null;

		s.push(source);
	}

	return new Video(getServer(), null, o);
}
