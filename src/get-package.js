import { getService } from '@nti/web-client';

import { PACKAGE_NOT_FOUND } from './constants';

export async function getPackage(id) {
	const service = await getService();

	try {
		return await service.getObject(id, {
			type: 'application/vnd.nextthought.contentpackage',
		});
	} catch (e) {
		//
	}

	// as of this change, only <mobile>/src/main/js/content/components/View.jsx
	// references this constant outside of this library.
	throw new Error(PACKAGE_NOT_FOUND);
}
