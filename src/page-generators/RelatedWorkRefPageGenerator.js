import {getModel} from '@nti/lib-interfaces';
import {getAppUsername} from '@nti/web-client';

const PageInfo = getModel('pageinfo');

export function getParams (relatedWork) {
	return {
		ntiid: relatedWork.NTIID,
		href: relatedWork.href,
		icon: relatedWork.icon,
		label: relatedWork.label || relatedWork.title,
		title: relatedWork.label || relatedWork.title,
		description: relatedWork.description,
		byline: relatedWork.byline,
		creator: relatedWork.byline,
		targetNTIID: relatedWork.target,
		targetMimeType: relatedWork.targetMimeType
	};
}

export function getParamsHTML (params) {
	let content = '';

	for (const [key, value] of Object.entries(params)) {
		if (value) {
			content += `<param name="${key}" value="${value}" />\n`;
		}
	}

	return content;
}

export function getObjectHTML (relatedWork, params) {
	const paramsHTML = getParamsHTML(params || getParams(relatedWork));

	return `
		<object class="nticard" type="application/vnd.nextthought.nticard" data-ntiid="${relatedWork.NTIID}" data-href="${relatedWork.href}">
			${paramsHTML}
		</object>
	`;
}

export function buildPageInfo (service, context, relatedWork, innerContent) {
	const {NTIID} = relatedWork;
	const content = `
		<head>
			<title>${relatedWork.label}</title>
		</head>
		<body>
			<div class="page-contents no-padding">
				${innerContent}
			</div>
		</body>
	`;

	const pi = new PageInfo(service, content, {
		ContentPackageNTIID: 'placeholder',
		ID: NTIID,
		NTIID,
		Links: [
			{
				Class: 'Link',
				href: `/dataserver2/users/${encodeURIComponent(getAppUsername())}/Pages(${encodeURIComponent(NTIID)})/UserGeneratedData`,
				rel: 'UserGeneratedData'
			},
			{
				Class: 'Link',
				href: `/dataserver2/users/${encodeURIComponent(getAppUsername())}/Pages(${encodeURIComponent(NTIID)})/RelevantContainedUserGeneratedData`,
				rel: 'RelevantContainedUserGeneratedData'
			}
		]
	});

	pi.getContent = () => Promise.resolve(content);

	return pi;
}

export default function generateRelatedWorkPage (service, context, relatedWork) {
	return buildPageInfo(service, context, relatedWork, getObjectHTML(relatedWork));
}
