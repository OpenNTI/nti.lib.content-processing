import Logger from '@nti/util-logger';

import parseDomObject from './object';

const logger = Logger.get('content:utils:dom-parsers:image');

const SIZE_MAP = {
	oversize: -2,
	actual: -1,
	full: 0,
	half: 1,
	quarter: 2,
};

const addPrefix = (list, prefix) => list.map(x => prefix + x);

const srcPropertyDescription = {
	enumerable: true,
	get() {
		let { size, sizes } = this.source;
		return sizes[size < 0 ? 0 : size];
	},
};

export function getImagesFromDom(contentElement) {
	let imageObjects = [];

	for (let i of contentElement.querySelectorAll('span > img')) {
		//Add Image definition to the list.
		imageObjects.push(parseImage(i));
	}

	return imageObjects;
}

export default function parseImage(image) {
	const i = parseDomObject(image);

	//The properties we want to consume are:
	// crossorigin
	// id
	// src
	// dataset:
	//  ntiImageFull
	//  ntiImageHalf
	//  ntiImageQuarter
	//  ntiImageSize: "full"

	let { src, dataset = {} } = i;
	let { caption, title } = dataset;
	if (i.caption || i.title) {
		caption = caption || i.caption;
		title = title || i.title;
	}

	let size = SIZE_MAP[dataset.ntiImageSize || 'actual']; //the currently represented size by the 'src' property
	let sizes = [
		dataset.ntiImageFull, // largest
		dataset.ntiImageHalf, // 50% of largest
		dataset.ntiImageQuarter, // 25% of largest
	];

	if (sizes.every(x => x == null)) {
		sizes = [src];
	}

	//lets try to be less confusing...remove the raw props.
	delete i.src;
	delete dataset.ntiImageFull;
	delete dataset.ntiImageHalf;
	delete dataset.ntiImageQuarter;
	delete dataset.ntiImageSize;
	if (Object.keys(dataset).length === 0) {
		delete i.dataset;
	}

	//the image selected is smaller than the original and should allow showing the larger one
	let zoomable = size > 0;

	// get the current source so we can figure out the prefix. (our content renderer auto-prefixes
	// all "src" and "href" attributes in our content)
	// if the size is "actual" or "oversized" the src value will be the value of the "full" src.
	let current = sizes[size] || sizes[0];

	// Attempt to discover the prefix...
	let prefix = src.replace(current, '');
	if (prefix === src) {
		prefix = ''; //couldn't find it.
	}

	//Validate the prefix...
	if (!/(\/$|^$)/.test(prefix) || src !== prefix + current) {
		logger.warn(
			'The content prefix does not meet expectations. prefix: "%s", current: "%s", src: "%s"',
			prefix,
			current,
			src
		);
	}

	//Apply the prefix to size sources (so they can just be used a la: new Image().src = source)
	sizes = addPrefix(sizes, prefix);

	//Format our data into a formalized structure.

	//(create a dynamic src prop so we do not duplicate strings in memory)
	Object.defineProperty(i, 'src', srcPropertyDescription);

	//Define Zoomable, and the source structure.
	Object.assign(i, {
		caption,
		title,
		zoomable,
		source: { prefix, sizes, size },
	});

	return i;
}
