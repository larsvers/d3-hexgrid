import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import license from 'rollup-plugin-license';

const	globals = {
	'd3-array': 'd3',
	'd3-geo': 'd3',
	'd3-hexbin': 'd3',
	'd3-polygon': 'd3'
}

export default {
	external: ['@babel/runtime'],
	input: 'index.js',
	output: {
		file: 'dist/d3-hexgrid.js',
		format: 'umd',
		name: 'd3',
		globals: globals,
	},
  plugins: [
    resolve(),
    commonjs(),
    babel({
			exclude: 'node_modules/**',
			babelHelpers: 'runtime'
    }),
    license({
			banner: {
				content: `d3-hexgrid plugin v<%= pkg.version %>. <%= pkg.repository.url %>.`,
				commentStyle: 'ignored',
			},
    }),
  ]
};