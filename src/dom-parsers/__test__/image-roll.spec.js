/* eslint-env jest */
import parseImageRoll from '../image-roll';

import {makeDOM} from './tools';

describe ('DOM Parsers: Parse Image Roll Elements', () => {

	test ('parseImageRoll should return a valid object', () => {
		const roll = makeDOM(`
			<object data="tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1"
				data-ntiid="tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1"
				type="application/vnd.nextthought.image-collection"
				>
				<param name="ntiid" value="tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1">
				<param name="title" value="Turn and Talk">
				<param name="description" value="Have members turn and talk to one another.">
				<span itemprop="nti-data-markupenabled nti-data-resizeable">
					<img crossorigin="anonymous"
						data-nti-image-full="resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/fd35e23767020999111e1f49239199b4c5eff23e.jpg"
						data-nti-image-half="resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						data-nti-image-quarter="resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/06aefff9765154841fac3704b0e59674fae7a005.jpg"
						data-nti-image-size="half"
						id="24686734500090cd0700cccb5837dca0"
						src="resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						style="width:600px"
						/>
				</span>
				<span itemprop="nti-data-markupenabled nti-data-resizeable">
					<img crossorigin="anonymous"
						data-nti-image-full="resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/fd35e23767020999111e1f49239199b4c5eff23e.jpg"
						data-nti-image-half="resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						data-nti-image-quarter="resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/06aefff9765154841fac3704b0e59674fae7a005.jpg"
						data-nti-image-size="half"
						id="2383613c183d29de77a2c2f1be8d70e0"
						src="resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						style="width:600px"
						/>
				</span>
				<span itemprop="nti-data-markupenabled nti-data-resizeable">
					<img crossorigin="anonymous"
						data-nti-image-full="resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/fd35e23767020999111e1f49239199b4c5eff23e.jpg"
						data-nti-image-half="resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						data-nti-image-quarter="resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/06aefff9765154841fac3704b0e59674fae7a005.jpg"
						data-nti-image-size="half"
						id="4a64b26521c4b4883b1666f2489def20"
						src="resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/2cff8dc544afd32305107ce559484cb4ce1730df.jpg"
						style="width:600px"
						/>
				</span>
			</object>
		`);

		const json = parseImageRoll(roll);

		expect(json).toEqual({
			data: 'tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1',
			dataset: {
				ntiid: 'tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1'
			},
			type: 'application/vnd.nextthought.image-collection',
			ntiid: 'tag:nextthought.com,2011-10:LitWorld-NTIIC-LitClub_Overview.ntiimagecollection.1',
			title: 'Turn and Talk',
			description: 'Have members turn and talk to one another.',
			images: [{
				crossorigin: 'anonymous',
				id: '24686734500090cd0700cccb5837dca0',
				style: 'width:600px',
				src: 'resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
				caption: undefined,
				title: undefined,
				zoomable: true,
				source: {
					prefix: '',
					sizes: [
						'resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/fd35e23767020999111e1f49239199b4c5eff23e.jpg',
						'resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
						'resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/06aefff9765154841fac3704b0e59674fae7a005.jpg'
					],
					size: 1
				}
			}, {
				crossorigin: 'anonymous',
				id: '2383613c183d29de77a2c2f1be8d70e0',
				style: 'width:600px',
				src: 'resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
				caption: undefined,
				title: undefined,
				zoomable: true,
				source: {
					prefix: '',
					sizes: [
						'resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/fd35e23767020999111e1f49239199b4c5eff23e.jpg',
						'resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
						'resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/06aefff9765154841fac3704b0e59674fae7a005.jpg'
					],
					size: 1
				}
			}, {
				crossorigin: 'anonymous',
				id: '4a64b26521c4b4883b1666f2489def20',
				style: 'width:600px',
				src: 'resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
				caption: undefined,
				title: undefined,
				zoomable: true,
				source: {
					prefix: '',
					sizes: [
						'resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/fd35e23767020999111e1f49239199b4c5eff23e.jpg',
						'resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/2cff8dc544afd32305107ce559484cb4ce1730df.jpg',
						'resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/06aefff9765154841fac3704b0e59674fae7a005.jpg'
					],
					size: 1
				}
			}]
		});
	});

});
