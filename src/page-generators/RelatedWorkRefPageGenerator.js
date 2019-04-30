import {getModel} from '@nti/lib-interfaces';
import {getAppUsername} from '@nti/web-client';

const PageInfo = getModel('pageinfo');

function getParams (relatedWork) {
	const params = {
		ntiid: relatedWork.NTIID,
		href: relatedWork.href,
		icon: relatedWork.icon,
		label: relatedWork.label,
		title: relatedWork.label,
		description: relatedWork.description,
		byline: relatedWork.byline,
		creator: relatedWork.byline,
		targetNTIID: relatedWork.target,
		targetMimeType: relatedWork.targetMimeType
	};

	let content = '';

	for (const [key, value] of Object.entries(params)) {
		if (value) {
			content += `<param name="${key}" value="${value}" />\n`;
		}
	}

	return content;
}

function getObjectHTML (relatedWork) {
	return `
		<object class="nticard" type="application/vnd.nextthought.nticard" data-ntiid="${relatedWork.NTIID}" data-href="${relatedWork.href}">
			${getParams(relatedWork)}
		</object>
	`;
}

export default function generateRelatedWorkPage (service, context, relatedWork) {
	const {NTIID} = relatedWork;
	const content = `
		<head>
			<title>${relatedWork.label}</title>
		</head>
		<body>
			<div class="page-contents no-padding">
				${getObjectHTML(relatedWork)}
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
