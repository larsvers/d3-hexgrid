import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const	globals = {
	'd3-array': 'd3'
}


export default {
	entry: 'index.js',
	output: {
		file: 'build/d3-tesselate.js',
		format: 'umd',
		name: 'd3',
		globals: globals,
		banner: '// d3-tesselate plugin',
	},
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};