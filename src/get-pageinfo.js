import {getService} from '@nti/web-client';

import GENERATORS from './page-generators';

const RegisteredGenerators = {};

export function registerGenerator (type, generator) {
	if (!Array.isArray(type)) {
		type = [type];
	}

	for (let t of type) {
		RegisteredGenerators[t] = generator;
	}
}


export function getPageInfo (ntiid, context, extras) {
	//Temp fix...
	const params = context ? {course: context.getID()} : void 0;
	return getService()
		.then(service => {
			return service.getPageInfo(ntiid, {parent: context, params})
				.catch(() => generatePageInfoFrom(ntiid, service, context, extras));
		});
}


async function generatePageInfoFrom (ntiid, service, context, extras) {
	const object = await getObject(ntiid, service, context, extras);
	const targetPageInfo = await getTargetPageInfo(object, service, context, extras);


	if (targetPageInfo) { return targetPageInfo; }

	const generator = RegisteredGenerators[object.MimeType] || GENERATORS[object.MimeType];

	if (!generator) {
		throw new Error('405: Method Not Allowed');
	}

	return generator(service, context, object);
}

async function getObject (ntiid, service, context, extras) {
	const {assessment} = extras || {};

	if (assessment && assessment.getID() === ntiid) { return assessment; }

	const params = context ? {course: context.getID()} : void 0;

	return service.getObject(ntiid, {parent: context, params});
}


async function getTargetPageInfo (object, service, context) {
	try {
		const {target} = object;
		const params = context ? {course: context.getID()} : void 0;

		if (!target) { return null; }

		return await service.getPageInfo(target, {parent: context, params});
	} catch (e) {
		return null;
	}
}
