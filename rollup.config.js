import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
	entry: 'src/index.js',
	format: 'cjs',
	dest: 'lib/index.js',
	sourceMap: true,
	exports: 'named',
	external: [
		'nti-lib-dom',
		'nti-lib-interfaces',
		'nti-util-logger',
		'nti-web-client',
		'uuid',
	],
	plugins: [
		babel({ exclude: 'node_modules/**' }),
		commonjs({
			ignoreGlobal: true
		}),
		json()
	]
};
