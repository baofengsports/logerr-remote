var GULPConfig = Object.freeze({
  bSync: {
    baseDir: 'app',
    proxy: 'http://localhost:8901',
    port: 8901
  },
  css: {
    basePath: 'src/stylesheets/**/*.scss',
    outputPath: 'app/assets/stylesheets',
    fileSuffix: '.min'
  },
  js: {
    basePath: 'src/scripts/**/*.js',
    outputPath: 'app/assets/scripts',
    fileSuffix: '.min'
  },
  views: {
    basePath: 'app/*.ejs'
  },
  autoprefixer: {
    condition: 'last 3 version'
  }
});

module.exports = GULPConfig;