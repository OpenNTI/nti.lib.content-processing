/* eslint-env jest */
import parseImage, { getImagesFromDom } from '../image';

import { makeDOM } from './tools';

describe('DOM Parsers: Parse Image Elements', () => {
	test('parseImage should return a valid object', () => {
		const img = makeDOM(`
			<img crossorigin="anonymous"
				data-nti-image-full="resources/full.jpg"
				data-nti-image-half="resources/half.jpg"
				data-nti-image-quarter="resources/quarter.jpg"
				data-nti-image-size="actual"
				id="4b6ac6da327a5c8c86b213222f0e4c8b"
				src="resources/full.jpg"
				style="width:400px"
				/>
		`);

		const json = parseImage(img);

		expect(json).toEqual({
			crossorigin: 'anonymous',
			id: '4b6ac6da327a5c8c86b213222f0e4c8b',
			style: 'width:400px',
			src: 'resources/full.jpg',
			caption: undefined,
			title: undefined,
			zoomable: false,
			source: {
				prefix: '',
				sizes: [
					'resources/full.jpg',
					'resources/half.jpg',
					'resources/quarter.jpg',
				],
				size: -1,
			},
		});
	});

	test('parseImage should understand any image', () => {
		const img = makeDOM(`
			<img src="resources/full.jpg"/>
		`);

		const json = parseImage(img);

		expect(json).toEqual({
			src: 'resources/full.jpg',
			caption: undefined,
			title: undefined,
			zoomable: false,
			source: {
				prefix: '',
				sizes: ['resources/full.jpg'],
				size: -1,
			},
		});
	});

	describe('getImagesFromDom', () => {
		test('should find images', () => {
			const imgs = makeDOM(`
				<span>
					<img crossorigin="anonymous"
						data-nti-image-full="resources/full.jpg"
						data-nti-image-half="resources/half.jpg"
						data-nti-image-quarter="resources/quarter.jpg"
						data-nti-image-size="actual"
						id="4b6ac6da327a5c8c86b213222f0e4c8b"
						src="resources/full.jpg"
						style="width:400px"
						/>
					<img crossorigin="anonymous"
						data-nti-image-full="resources/full.jpg"
						data-nti-image-half="resources/half.jpg"
						data-nti-image-quarter="resources/quarter.jpg"
						data-nti-image-size="actual"
						id="4b6ac6da327a5c8c86b213222f0e4c8b"
						src="resources/full.jpg"
						style="width:400px"
						/>
				</span>
			`);

			const result = getImagesFromDom(imgs);
			expect(result.length).toBe(2);
			for (let image of result) {
				expect('src' in image).toBeTruthy();
			}
		});
	});
});
