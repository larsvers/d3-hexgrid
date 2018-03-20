import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	output: {
		file: 'build/d3-tesselate.js',
		format: 'umd',
		name: 'd3',
		banner: '// d3-tesselate plugin',
	},
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};