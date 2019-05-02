import generateRelatedWorkpage from './RelatedWorkRefPageGenerator';

export default function generateExternToolAssetPage (service, context, externalTool) {
	return generateRelatedWorkpage(service, context, externalTool);
}
