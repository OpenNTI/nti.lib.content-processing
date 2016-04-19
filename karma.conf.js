const baseConfig = require('nti-unittesting-clientside');

module.exports = function (config) {
	baseConfig.webpack.resolve.root = void 0;

	config.set(Object.assign(baseConfig, {
		files: [
			'test/**/*.js'
		],

		proxies: {
			'/generic.png': 'test/assets/generic.png',
			'/resources/full.jpg': 'test/assets/generic.png',
			'/resources/half.jpg': 'test/assets/generic.png',
			'/prefix/resources/full.jpg': 'test/assets/generic.png',
			'/resources/LitClub_Overview/34019dd53b124dfcfe2b0722094181391ad222da/2cff8dc544afd32305107ce559484cb4ce1730df.jpg': 'test/assets/generic.png',
			'/resources/LitClub_Overview/38748e66fc09bf2438ddd939f7ebf96dcc59b351/2cff8dc544afd32305107ce559484cb4ce1730df.jpg': 'test/assets/generic.png',
			'/resources/LitClub_Overview/04cbdb91c036e345dd5fd9b53cd319a5ccfc22b1/2cff8dc544afd32305107ce559484cb4ce1730df.jpg': 'test/assets/generic.png'
		},

		preprocessors: {
			'test/**/*.js': ['webpack', 'sourcemap']
		}
	}));
};
