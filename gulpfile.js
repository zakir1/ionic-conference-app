/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/

// node module imports
var gulp = require('gulp'),
    webpack = require('webpack'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch');


var IONIC_DIR = "node_modules/ionic-framework/"

/******************************************************************************
 * watch
 * Build the app, and rebuild when source files change.
 * Also starts a local web server.
 ******************************************************************************/
gulp.task('watch', ['sass', 'fonts'], function(done) {
  watch('www/app/**/*.scss', function(){
    gulp.start('sass');
  });
  compile(true, function(){
    gulp.start('serve');
    done();
  });
});


/******************************************************************************
 * build
 * Build the app once, without watching for source file changes.
 ******************************************************************************/
gulp.task('build', ['sass', 'fonts'], function(done) {
  compile(false, done);
});


/******************************************************************************
 * sass
 * Convert Sass files to a single bundled CSS file. Uses auto-prefixer
 * to automatically add required vendor prefixes when needed.
 ******************************************************************************/
gulp.task('sass', function(){
  var autoprefixerOpts = {
    browsers: [
      'last 2 versions',
      'iOS >= 7',
      'Android >= 4',
      'Explorer >= 10',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  };

  return gulp.src('app/theme/app.+(ios|md).scss')
    .pipe(sass({
      includePaths: [IONIC_DIR],
    }))
    .on('error', function(err){
      console.error(err.message);
      this.emit('end');
    })
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(gulp.dest('www/build/css'))
});


/******************************************************************************
 * fonts
 * Copy Ionic font files to build directory.
 ******************************************************************************/
gulp.task('fonts', function() {
  return gulp.src(IONIC_DIR + 'fonts/**/*.+(ttf|woff|woff2)')
    .pipe(gulp.dest('www/build/fonts'));
});


/******************************************************************************
 * clean
 * Delete previous build files.
 ******************************************************************************/
gulp.task('clean', function(done) {
  var del = require('del');
  del(['www/build'], done);
});


/******************************************************************************
 * Compile
 ******************************************************************************/
function compile(watch, cb) {
  // prevent gulp calling done callback more than once when watching
  var firstTime = true;

  // load webpack config
  var config = require('./webpack.config.js');

  // https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions
  var statsOptions = {
    'colors': true,
    'modules': true,
    'chunks': false,
    'exclude': ['node_modules']
  }

  var compiler = webpack(config);
  if (watch) {
    compiler.watch(null, compileHandler);
  } else {
    compiler.run(compileHandler);
  }

  function compileHandler(err, stats){
    if (firstTime) {
      firstTime = false;
      cb();
    }

    // print build stats and errors
    console.log(stats.toString(statsOptions));
  }
}
