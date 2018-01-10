/* eslint-env jest */
import parseVideoRoll from '../video-roll';

import {makeDOM} from './tools';

describe ('DOM Parsers: Parse Video Roll Elements', () => {
	const originalConfig = global.$AppConfig;

	afterEach(() => global.$AppConfig = originalConfig);

	beforeEach(() => {
		global.$AppConfig = {
			nodeInterface: {}
		};
	});

	test ('parseVideoRoll should return a valid object', () => {
		const roll = makeDOM(`
			<object data="tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1"
				data-ntiid="tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1"
				type="application/vnd.nextthought.videoroll"
				>
				<param name="ntiid" value="tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1">
				<param name="title" value="The Hello Song">
				<param name="description" value="Watch examples of the Hello Song">
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
				<object class="ntivideo"
					data-ntiid="tag:nextthought.com,2011-10:LitWorld-NTIVideo-LitClub_Celebrations.ntivideo.video_Hello_Song_Cora"
					itemprop="presentation-video"
					type="application/vnd.nextthought.ntivideo"
					>
					<param name="title" value="Hello Song Cora">
					<object data-height="360" data-priority="0" data-width="640"
						type="application/vnd.nextthought.videosource"
						>
						<param name="service" value="youtube">
						<param name="source" value="mtahHh-Umrk">
						<param name="height" value="360">
						<param name="width" value="640">
						<param name="poster" value="//img.youtube.com/vi/mtahHh-Umrk/0.jpg">
						<param name="thumbnail" value="//img.youtube.com/vi/mtahHh-Umrk/1.jpg">
					</object>
				</object>
			</object>
		`);

		const json = parseVideoRoll(roll, null);
		//force the value to primitve objects...
		const raw = JSON.parse(JSON.stringify(json));

		expect(raw).toEqual({
			data: 'tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1',
			dataset: {
				ntiid: 'tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1'
			},
			description: 'Watch examples of the Hello Song',
			MimeType: 'application/vnd.nextthought.videoroll',
			NTIID: 'tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1',
			ntiid: 'tag:nextthought.com,2011-10:LitWorld-NTIVR-LitClub_Celebrations.ntivideoroll.1',
			title: 'The Hello Song',
			type: 'application/vnd.nextthought.videoroll',
			videos: [
				{
					isVideo: true,
					MimeType: 'application/vnd.nextthought.ntivideo',
					NO_TRANSCRIPT: 'No Transcript',
					NO_TRANSCRIPT_LANG: 'No Transcript for the requested language.',
					NTIID: 'tag:nextthought.com,2011-10:LitWorld-NTIVideo-LitClub_Celebrations.ntivideo.video_Hello_Song_Annie_Foley',
					EXISTING_TRANSCRIPT: 'A Transcript already exists',
					itemprop: 'presentation-video',
					title: 'Hello Song Annie Foley',
					sources: [
						{
							MimeType: 'application/vnd.nextthought.videosource',
							dataset: {
								height: '360',
								priority: '0',
								width: '640'
							},
							type: 'application/vnd.nextthought.videosource',
							title: 'undefined',
							service: 'youtube',
							source: '-no2o7TeHNA',
							height: 360,
							width: 640,
							poster: '//img.youtube.com/vi/-no2o7TeHNA/0.jpg',
							thumbnail: '//img.youtube.com/vi/-no2o7TeHNA/1.jpg'
						}
					]
				}, {
					isVideo: true,
					MimeType: 'application/vnd.nextthought.ntivideo',
					NO_TRANSCRIPT: 'No Transcript',
					NO_TRANSCRIPT_LANG: 'No Transcript for the requested language.',
					NTIID: 'tag:nextthought.com,2011-10:LitWorld-NTIVideo-LitClub_Celebrations.ntivideo.video_Hello_Song_Cora',
					EXISTING_TRANSCRIPT: 'A Transcript already exists',
					itemprop: 'presentation-video',
					title: 'Hello Song Cora',
					sources: [
						{
							MimeType: 'application/vnd.nextthought.videosource',
							dataset: {
								height: '360',
								priority: '0',
								width: '640'
							},
							type: 'application/vnd.nextthought.videosource',
							service: 'youtube',
							source: 'mtahHh-Umrk',
							height: 360,
							width: 640,
							poster: '//img.youtube.com/vi/mtahHh-Umrk/0.jpg',
							thumbnail: '//img.youtube.com/vi/mtahHh-Umrk/1.jpg'
						}
					]
				}
			]
		});
	});

});
