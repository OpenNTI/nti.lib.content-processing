import {
	buildPageInfo,
	getObjectHTML,
	getParams,
} from './RelatedWorkRefPageGenerator';

export default function generateExternToolAssetPage(
	service,
	context,
	externalTool
) {
	const params = getParams(externalTool);
	const href = externalTool.getLink('Launch');

	if (href) {
		params.href = href;
	}

	const object = getObjectHTML(externalTool, params);

	return buildPageInfo(service, context, externalTool, object);
}
