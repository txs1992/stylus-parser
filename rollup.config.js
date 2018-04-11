// import { minify } from 'uglify-es'
import babel from 'rollup-plugin-babel'
// import uglify from 'rollup-plugin-uglify'
import eslint from 'rollup-plugin-eslint'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    name: 'StylusToAST',
    format: 'umd'
  },
  plugins: [
    commonjs(),
    resolve(),
    eslint({
      throwError: true,
      exclude: 'node_modules/**'
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
  ]
}
