import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';

const	globals = {
	'd3-array': 'd3',
	'd3-geo': 'd3',
	'd3-hexbin': 'd3',
	'd3-polygon': 'd3'
}

export default {
	entry: 'index.js',
	output: {
		file: 'dist/d3-hexgrid.js',
		format: 'umd',
		name: 'd3',
		globals: globals,
	},
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    license({
      banner: `d3-hexgrid plugin v<%= pkg.version %>. <%= pkg.repository.url %>.`
    }),
  ]
};