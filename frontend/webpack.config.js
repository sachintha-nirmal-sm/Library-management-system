module.exports = {
  // ... existing webpack config ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/@zxing/], // Exclude @zxing library from source-map-loader
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/], // Ignore source map parsing warnings
}; 