import { replaceNode, parent } from '@nti/lib-dom';
import { v4 as uuid } from 'uuid';

/**
 * @param {Object} strategies		An object where the keys are the CSS selectors for widgets, and
 *                             		the values are functions to transform that selected element into
 *                             		an Object used to render the Widget.
 *
 * @param {Document} doc			The content to search.
 *
 * @param {Node} elementFactory		A Dom object that has an implementation for 'createComment'.
 * @param {ServiceDocument} service	The Service document for your session.
 * @returns {Object[]} An array of objects representing widgets.
 */
export function parseWidgets(strategies, doc, elementFactory, service) {
	function makeMarker(id) {
		return elementFactory.createComment('nti:widget-marker[' + id + ']');
	}

	function flatten(list, array) {
		if (!Array.isArray(array)) {
			array = [array];
		}

		list.push(...array);

		return list;
	}

	let selectors = Object.keys(strategies);

	return selectors
		.map(selector =>
			Array.from(doc.querySelectorAll(selector))
				//do not process nested objects
				.filter(el => selectors.every(x => !parent(el.parentNode, x)))
				.map(el => {
					let id = el.getAttribute('id');
					let result = strategies[selector](el, service) || {
						element: el,
					};

					if (!id) {
						el.setAttribute('id', (id = uuid()));
					}

					replaceNode(el, makeMarker(id));

					result.guid = id;
					return result;
				})
		)
		.reduce(flatten, []);
}
