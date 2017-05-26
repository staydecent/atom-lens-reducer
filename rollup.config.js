import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import closure from 'rollup-plugin-closure-compiler-js'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'lensReducer',
  dest: 'bundle.js',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**',  // Default: undefined

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false  // Default: true
    }),
    cleanup({
      comments: 'none'
    }),
    closure()
  ]
}
