/* eslint-env jest */
import {
	getContent,
	parseHTML,
	processContent,
	parseWidgets,
	filterContent,
	getHTMLSnippet
} from '../index';

const SAMPLE_CONTENT = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
	<head>
		<meta content="2015-04-29T15:42:13" http-equiv="last-modified" />
		<meta content="3764" name="NTIRelativeScrollHeight" />
		<meta content="tag:nextthought.com,2011-10:NextThought-HTML-NextThoughtFAQ.nextthought_faq" name="NTIID" />
		<meta content="NextThought" name="generator" />
		<meta content="text/html; charset=ascii" http-equiv="content-type" />
		<title>NextThought FAQ</title>
		<link href="styles/styles.css" rel="stylesheet" />
		<link href="styles/content.css" rel="stylesheet" />
	</head>
	<body id="NTIContent">
		<div class="page-contents">
			<a name="291b7311d8bfaf12538018c021844717"></a>
			<div class="minipage" style="width:450.0pt">
				<div class="align-center">
					<span itemprop="nti-data-markupdisabled">
						<dead:img crossorigin="anonymous" data-nti-image-full="resources/NextThoughtFAQ/48a832239002373eb16789711d60690a8e3d1411/fd35e23767020999111e1f49239199b4c5eff23e.jpg" data-nti-image-half="resources/NextThoughtFAQ/48a832239002373eb16789711d60690a8e3d1411/2cff8dc544afd32305107ce559484cb4ce1730df.jpg" data-nti-image-quarter="resources/NextThoughtFAQ/48a832239002373eb16789711d60690a8e3d1411/06aefff9765154841fac3704b0e59674fae7a005.jpg" data-nti-image-size="actual" id="4b6ac6da327a5c8c86b213222f0e4c8b" src="resources/NextThoughtFAQ/48a832239002373eb16789711d60690a8e3d1411/fd35e23767020999111e1f49239199b4c5eff23e.jpg" style="width:400px" />
					</span>
				</div>
			</div>
			<a name="6057d32394be0ffeb6f4740396c73532"></a>

			p class="par" id="6057d32394be0ffeb6f4740396c73532">Last Updated: September 13, 2013 </p>
			<div class="subsection title" id="a0000000001" ntiid="tag:nextthought.com,2011-10:NextThought-HTML-NextThoughtFAQ.system_requirements">System Requirements</div>
			<a name="b3dfbcdbc895f16ba703ce9e24a03b66"></a>

			p class="par" id="b3dfbcdbc895f16ba703ce9e24a03b66"> We recommend you meet the following specifications to ensure the highest quality experience while using NextThought: </p>
			<a name="7653f1a74ebd2b8cfaba26b263e91640"></a>
			<ul class="itemize">
				<li>
					<a name="17b4acea6b215b49abf752368599601c"></a>
					<p class="par" id="17b4acea6b215b49abf752368599601c"> 1Mb/s+ broadband Internet connection </p>
				</li>
				<li>
					<a name="2a463720760cc6622277c043c4fb21c0"></a>
					<p class="par" id="2a463720760cc6622277c043c4fb21c0"> A computer with at least 2GB memory and minimum screen resolution of 1024x768 </p>
				</li>
				<li>
					<a name="92f33d5ad28716d3223f2ff892d38aa2"></a>
					<p class="par" id="92f33d5ad28716d3223f2ff892d38aa2"> Supported browsers: Currently, some features may work better on certain browsers than others. We prefer the most up-to-date versions of the following browsers in ranked order: <b class="bfseries">(1) Chrome, (2) Safari 6+, (3) Firefox 5.0+, (4) Internet Explorer 9+.</b> If you experience problems, or if certain features do not seem to work, please consider downloading a more highly preferred browser or updating the version of the browser you are using. </p>
				</li>
				<li>
					<a name="f8abb5a2e0b5dffa50dd9d7182f3fcce"></a>
					<p class="par" id="f8abb5a2e0b5dffa50dd9d7182f3fcce"> Mobile support: NextThought is only accessible on tablet browsers. Mobile phones are not supported for the time being. We are developing an iPad app and expect it to be available in the coming months. </p>
				</li>
				<li>
					<a name="09674d33a9c5c80f56b7e3abe23b68f4"></a>
					<p class="par" id="09674d33a9c5c80f56b7e3abe23b68f4"> Adobe Reader or similar PDF reading software (<a></a>http://get.adobe.com/reader/) </p>
				</li>
				<li>
					<a name="9f8e46c350742b4d1d54d8b60d28ba3f"></a>
					<p class="par" id="9f8e46c350742b4d1d54d8b60d28ba3f"> Adobe Flash (<a></a>http://get.adobe.com/flashplayer/) </p>
				</li>
			</ul>
			<div class="subsection title" id="a0000000002" ntiid="tag:nextthought.com,2011-10:NextThought-HTML-NextThoughtFAQ.frequently_asked_questions">Frequently Asked Questions</div>
			<a name="6ccb82f8821fd12336c49a70bbeb56aa"></a>
			<p class="par" id="6ccb82f8821fd12336c49a70bbeb56aa"><b class="bfseries">What is NextThought?</b>
			<br />
			NextThought is a course delivery platform, offering interactive content and rich features to make learning both social and personal. To learn more about NextThought, visit <a></a>www.nextthought.com or contact us at <a></a>feedback@nextthought.com. </p>
		</div>
	</body>
</html>
`;


describe ('Content Processing', () => {
	global.$AppConfig = {
		nodeService: {
			//mock service
		}
	};

	describe ('Helpers', () => {

		test ('getContent strips xml pragmas & junk', () => {
			const html = '<html><body>hi</body></html>';
			const doctyped = `<!DOCTYPE html>${html}`;
			const junkA = `  <xml>aslkdjasdlkjasd ${html}`;
			const junkB = `  <xml>aslkdjasdlkjasd ${doctyped}`;

			expect(getContent(junkA)).toBe(html);
			expect(getContent(junkB)).toBe(doctyped);
		});


		test ('parseHTML parses text into DOM', async () => {
			const html = '<html><body><div id="content">hi</div></body></html>';
			const dom = await parseHTML(html);

			expect(dom).not.toBe(html);
			expect(dom).toBeTruthy();
			expect(dom.nodeType).toBeTruthy();

			expect(dom.getElementsByTagName).toBeTruthy();
			expect(dom.querySelectorAll).toBeTruthy();

			const div = dom.querySelectorAll('#content')[0];

			expect(div).toBeTruthy();
			expect(div && div.textContent).toBe('hi');
		});


		test ('filterContent removes untrusted elements, and attributes', () => {
			const html = `
				<!DOCTYPE html>
				<html>
					<head>
						<title>test</title>
					</head>
					<body>
						<script>alert('foo!');</script>
						<script src="somescript.js"></script>
						<div name="p" class="box" style="background:red;">testing...</div>
						<p name="par1" style="background:green;">paragraph</p>
						<span id="myblock">
							<u>u</u> <b>b</b> <i>i</i> <strong>string</strong> <em>em</em>
							<br/>
						</span>
						<iframe src="badplace.html">
						<object>
							<param foobar>
						</object>
					</body>
				</html>
			`;

			//The tabbing is important! filterContent should preserve spacing.
			const clean = `<div>testing...</div>
						<p>paragraph</p>
						<span>
							<u>u</u> <b>b</b> <i>i</i> <strong>string</strong> <em>em</em>
							<br>
						</span>`;

			expect(filterContent(html)).toBe(clean);
		});


		test ('getHTMLSnippet limits character count of text nodes only', () => {
			const html = `
				<fieldset class="mBottom">
					<legend>Lorem ipsum: usage</legend>
					<img class="img" alt="lorem ipsum info" src="/img/0.gif" title="Marcus Tullius Cicero" style="" id="c7">
					<p id="mBottom0"><strong>Lorem ipsum</strong> is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its content nonsensical; it's not genuine, correct, or comprehensible Latin anymore. While <strong>lorem ipsum</strong>'s still resembles classical Latin, it actually has no meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.</p>
					<img class="img" alt="lorem ipsum info" src="/img/0.gif" title="Marcus Tullius Cicero" style="" id="c7">
					<br class="clear">
					<p id="mBottom1">In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. <strong>Lorem ipsum</strong> and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century.</p><img class="img" alt="lorem ipsum info" src="/img/0.gif" title="decorative vignette based on Lorem Ipsum" style="" id="c8">
					<p id="mBottom5">Cicero famously orated against his political opponent Lucius Sergius Catilina. Occasionally the first Oration against Catiline is taken for type specimens: Quo usque tandem abutere, Catilina, patientia nostra? Quam diu etiam furor iste tuus nos eludet? (How long, O Catiline, will you abuse our patience? And for how long will that madness of yours mock us?)<br><br> In 1985 Aldus Corporation launched its first desktop publishing program Aldus PageMaker for Apple Macintosh computers, released in 1987 for PCs running Windows 1.0. Both contained the variant lorem ipsum most common today. Laura Perry, then art director with Aldus, modified prior versions of <strong>Lorem Ipsum</strong> text from typographical specimens; in the 1960s and 1970s it appeared often in lettering catalogs by Letraset. Anecdotal evidence has it that Letraset used <strong>Lorem ipsum</strong> already from 1970 onwards, eg. for grids (page layouts) for ad agencies. Many early desktop publishing programs, eg. Adobe PageMaker, used it to create templates.</p>
				</fieldset>`;

			const expected50 = '<fieldset class="mBottom"><legend>Lorem ipsum: usage</legend><img class="img" alt="lorem ipsum info" src="/img/0.gif" title="Marcus Tullius Cicero" style="" id="c7"><p id="mBottom0"><strong>Lorem ipsum</strong> is a pseudo-Latin...</p><img class="img" alt="lorem ipsum info" src="/img/0.gif" title="Marcus Tullius Cicero" style="" id="c7"><br class="clear"><p id="mBottom1"></p><img class="img" alt="lorem ipsum info" src="/img/0.gif" title="decorative vignette based on Lorem Ipsum" style="" id="c8"><p id="mBottom5"><br><br></p></fieldset>';

			const limit50 = getHTMLSnippet(html, 50);

			expect(limit50).toBe(expected50);
		});


		test ('parseWidgets', async () => {
			const dom = await parseHTML(`
				<div>
					<object type="funtimes">
						<param name="test" value="foobar"/>
					</object>

					<img src="generic.png"/>
				</div>
			`);

			const strategies = {
				'object[type=funtimes]': e => ({element: e, type: 'funtimes'}),
				'img': e => ({src: e.getAttribute('src')})
			};

			function getCommentNodes (node) {
				const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT, null, false);
				const comments = [];
				while (treeWalker.nextNode()) {
					comments.push(treeWalker.currentNode);
				}
				return comments;
			}

			const results = parseWidgets(strategies, dom, dom);

			for(let selector of Object.keys(strategies)) {
				expect(dom.querySelector(selector)).toBe(null);
			}

			const placeholders = getCommentNodes(dom)
				.filter(x => /nti:widget-marker/.test(x.textContent));

			expect(placeholders.length).toBe(2);

			expect(Array.isArray(results)).toBe(true);
			expect(results && results.length).toBe(2);

			const [funtimes, img] = results;

			expect(funtimes.type).toBe('funtimes');
			expect(img.src).toBe('generic.png');
		});
	});

	describe ('Processes Content', () => {

		test ('Get Processed Packet', async () => {
			const originalPacket = {content: SAMPLE_CONTENT, arbitrary: 'value'};
			const dummyStrats = {
				'span[itemprop=nti-data-markupdisabled]': () => ({}),
				'ul.itemize': () => ({})
			};

			const packet = await processContent(originalPacket, dummyStrats);

			expect(packet).not.toBe(originalPacket);
			expect(packet.arbitrary).toBe('value');
			expect(packet.content).toBeTruthy();
			expect(packet.body.every(x => typeof x === 'object' ? true : !x.includes('nti:widget-marker'))).toBeTruthy();
			expect(typeof packet.content).toBe('string');
			expect(Array.isArray(packet.body)).toBe(true);
			expect(packet.body.every(x => /object|string/.test(typeof x))).toBeTruthy();
			expect(packet.styles).toEqual(['styles/styles.css', 'styles/content.css']);
			expect(packet.widgets).toBeTruthy();
			expect(Object.keys(packet.widgets).length).toBe(2);
		});
	});
});
