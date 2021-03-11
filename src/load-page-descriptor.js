import Logger from '@nti/util-logger';
import { parseNTIID } from '@nti/lib-ntiids';

import PageDescriptor from './PageDescriptor';
import { getPageInfo } from './get-pageinfo';
import { getPageContent } from './get-page-content';

const logger = Logger.get('lib:content-processing:load');

/**
 *	@param {string} ntiid Content Page - NTIID
 *	@param {Package|Bundle|Instance} context - An instance of a Content/Course model
 *	@param {Object} [extra] - props, or extra config to pass along
 *	@returns {void}
 */
export function loadPageDescriptor(ntiid, context, extra) {
	let isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	function loadTOC(id) {
		if (!id || id === 'placeholder') {
			return null;
		}

		const loadPackage = Promise.resolve(
			context.getPackage(id) ||
				context.refresh().then(() => context.getPackage(id))
		);

		return loadPackage.then(
			async p =>
				p?.getTableOfContents?.() ||
				Promise.reject(new Error('No Package for Page!'))
		);
	}

	return getPageInfo(ntiid, context, extra)
		.then(pageInfo => {
			if (pageInfo.getID() !== ntiid && !isAssessmentID) {
				// We will always missmatch for assessments, since we
				// get the pageInfo for an assessment id and the server
				// returns the pageInfo that the assessment is on...
				// so lets silence this error for that case.
				logger.warn(
					'PageInfo ID missmatch! %s != %s %o',
					ntiid,
					pageInfo.getID()
				);
			}

			return Promise.all([
				//Load the toc
				loadTOC(pageInfo.getPackageID()),

				//Load the page html
				getPageContent(pageInfo),

				//Get the data store. (Important note: the store itself will load in parallel
				// (and not block page render))
				pageInfo.getUserData(),
			]).then(pack => {
				let [tableOfContents, packet, userDataStore] = pack;
				return Object.assign(packet, {
					tableOfContents,
					userDataStore,
				});
			});
		})

		.then(packet => new PageDescriptor(ntiid, packet))
		.catch(error => Promise.reject(error));
}
