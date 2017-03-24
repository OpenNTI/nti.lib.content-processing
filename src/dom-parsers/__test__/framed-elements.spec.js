import {getModel} from 'nti-lib-interfaces';

import parseFramedElement from '../framed-elements';

import {makeDOM} from './tools';

const Video = getModel('video');

describe('DOM Parsers: Parse Framed Elements', () => {
	const originalConfig = global.$AppConfig;

	afterEach(() => global.$AppConfig = originalConfig);

	beforeEach(() => {
		global.$AppConfig = {
			nodeInterface: {}
		};
	});

	it ('parseFramedElement should return a valid object', () => {
		const frame = makeDOM(`
			<span itemprop="nti-data-markupdisabled">
				<img crossorigin="anonymous"
					data-nti-image-full="resources/full.jpg"
					data-nti-image-half="resources/half.jpg"
					data-nti-image-quarter="resources/quarter.jpg"
					data-nti-image-size="actual"
					id="4b6ac6da327a5c8c86b213222f0e4c8b"
					src="/prefix/resources/full.jpg"
					style="width:400px"
					/>
			</span>
		`);

		const json = parseFramedElement(frame);

		expect(json).toEqual({
			itemprop: 'nti-data-markupdisabled',
			item: {
				crossorigin: 'anonymous',
				id: '4b6ac6da327a5c8c86b213222f0e4c8b',
				style: 'width:400px',
				src: '/prefix/resources/full.jpg',
				caption: undefined,
				title: undefined,
				zoomable: false,
				markable: false,
				source: {
					prefix: '/prefix/',
					sizes: ['/prefix/resources/full.jpg', '/prefix/resources/half.jpg', '/prefix/resources/quarter.jpg'],
					size: -1
				}
			},
			type: 'nti-data-markupdisabled',
			markable: false,
			isSlide: false
		});
	});

	it ('markup allowed', () => {
		//markupenabled is the trigger to turn on markable
		const frame = makeDOM(`
			<span itemprop="nti-data-markupenabled">
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

		const json = parseFramedElement(frame);

		expect(json.markable).toBe(true);
		expect(json.item.markable).toBe(true);
	});

	it ('zoomable', () => {
		const frame = makeDOM(`
			<span itemprop="nti-data-markupdisabled">
				<img crossorigin="anonymous"
					data-nti-image-full="resources/full.jpg"
					data-nti-image-half="resources/half.jpg"
					data-nti-image-quarter="resources/quarter.jpg"
					data-nti-image-size="half"
					id="4b6ac6da327a5c8c86b213222f0e4c8b"
					src="resources/half.jpg"
					style="width:400px"
					/>
			</span>
		`);

		const json = parseFramedElement(frame);

		expect(json.item.zoomable).toBe(true);
		expect(json.item.source.size).toBe(1);
	});

	it ('handle unexpected', () => {
		const frame = makeDOM(`
			<span itemprop="nti-data-markupdisabled">
				asd
			</span>
		`);

		const json = parseFramedElement(frame);

		expect(json.item).toEqual({markable: false});
	});

	it ('handle video', () => {
		const frame = makeDOM(`
			<span itemprop="nti-data-markupdisabled">
				<object class="ntivideo"
					data-ntiid="tag:nextthought.com,2011-10:LitWorld-NTIVideo-LitClub_Celebrations.ntivideo.video_Hello_Song_Annie_Foley"
					itemprop="presentation-video"
					type="application/vnd.nextthought.ntivideo"
					>
					<param name="title" value="Hello Song Annie Foley">
					<object data-height="360" data-priority="0" data-width="640"
						type="application/vnd.nextthought.videosource"
						title="undefined"
						>
						<param name="service" value="youtube">
						<param name="source" value="-no2o7TeHNA">
						<param name="height" value="360">
						<param name="width" value="640">
						<param name="poster" value="//img.youtube.com/vi/-no2o7TeHNA/0.jpg">
						<param name="thumbnail" value="//img.youtube.com/vi/-no2o7TeHNA/1.jpg">
					</object>
				</object>
			</span>
		`);

		const json = parseFramedElement(frame);

		expect(json.item instanceof Video).toBeTruthy();
	});

});
