import { getService } from '@nti/web-client';

import { PACKAGE_NOT_FOUND } from './constants';

export async function getPackage(id) {
	const service = await getService();

	try {
		return await service.getObject(id);
	} catch (e) {
		//
	}

	throw PACKAGE_NOT_FOUND;
}
