/* eslint-env jest */
import {getModel} from 'nti-lib-interfaces';

import parseVideo, {getVideosFromDom} from '../video';

import {makeDOM} from './tools';

const Video = getModel('video');

describe ('DOM Parsers: Parse Video Elements', () => {
	const originalConfig = global.$AppConfig;

	afterEach(() => global.$AppConfig = originalConfig);

	beforeEach(() => {
		global.$AppConfig = {
			nodeInterface: {}
		};
	});

	test ('parseVideo should return a valid object', () => {
		const vid = makeDOM(`
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
		`);

		const json = parseVideo(vid);

		expect(json instanceof Video).toBeTruthy();

		const raw = JSON.parse(JSON.stringify(json));

		expect(raw).toEqual({
			isVideo: true,
			NO_TRANSCRIPT: 'No Transcript',
			NO_TRANSCRIPT_LANG: 'No Transcript for the requested language.',
			EXISTING_TRANSCRIPT: 'A Transcript already exists',
			MimeType: 'application/vnd.nextthought.ntivideo',
			NTIID: 'tag:nextthought.com,2011-10:LitWorld-NTIVideo-LitClub_Celebrations.ntivideo.video_Hello_Song_Annie_Foley',
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
		});
	});


	describe ('getVideosFromDom', () => {
		test ('should find videos', () => {
			const videos = makeDOM(`
				<span>
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
				</span>
			`);

			const result = getVideosFromDom(videos);
			expect(result.length).toBe(2);
			for (let video of result) {
				expect(video instanceof Video).toBeTruthy();
				expect('sources' in video).toBeTruthy();
			}
		});
	});
});
