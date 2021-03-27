import Logger from '@nti/util-logger';
import { parseNTIID } from '@nti/lib-ntiids';

import PageDescriptor from './PageDescriptor';
import { getPageInfo } from './get-pageinfo';
import { getPageContent } from './get-page-content';
import { getPackage } from './get-package';

const logger = Logger.get('lib:content-processing:load');

async function loadTOC(id, context) {
	try {
		if (!id || id === 'placeholder') {
			return null;
		}

		let pkg = null; //await context.getPackage(id);

		if (!pkg) {
			pkg = await getPackage(id);
		}

		return await pkg?.getTableOfContents();
	} catch (e) {
		return null;
	}
}

/**
 *	@param {string} ntiid Content Page - NTIID
 *	@param {Package|Bundle|Instance} context - An instance of a Content/Course model
 *	@param {Object} [extra] - props, or extra config to pass along
 *	@returns {void}
 */
export async function loadPageDescriptor(ntiid, context, extra) {
	let isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	const pageInfo = await getPageInfo(ntiid, context, extra);

	if (pageInfo.getID() !== ntiid && !isAssessmentID) {
		// We will always mismatch for assessments, since we
		// get the pageInfo for an assessment id and the server
		// returns the pageInfo that the assessment is on...
		// so lets silence this error for that case.
		logger.warn(
			'PageInfo ID mismatch! %s != %s %o',
			ntiid,
			pageInfo.getID()
		);
	}

	const [tableOfContents, packet, userDataStore] = await Promise.all([
		//Load the toc
		loadTOC(pageInfo.getPackageID(), context),

		//Load the page html
		getPageContent(pageInfo),

		//Get the data store. (Important note: the store itself will load in parallel
		// (and not block page render))
		pageInfo.getUserData(),
	]);

	Object.assign(packet, {
		tableOfContents,
		userDataStore,
	});

	return new PageDescriptor(ntiid, packet);
}
