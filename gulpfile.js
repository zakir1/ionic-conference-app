/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/

// node module imports
var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch');


var IONIC_DIR = "node_modules/ionic-framework/"


/******************************************************************************
 * watch
 * Build the app and watch for source file changes.
 ******************************************************************************/
gulp.task('watch', ['sass', 'copy.fonts', 'copy.html'], function(done) {
  watch('www/app/**/*.scss', function(){
    gulp.start('sass');
  });
  watch('www/app/**/*.html', function(){
    gulp.start('copy.html');
  });
  return bundleTask(true);
});


/******************************************************************************
 * build
 * Build the app once, without watching for source file changes.
 ******************************************************************************/
gulp.task('build', ['sass', 'copy.fonts', 'copy.html'], function() {
  return bundleTask();
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
      includePaths: [
        IONIC_DIR,
        'node_modules/ionicons/dist/scss'
      ]
    }))
    .on('error', function(err){
      console.error(err.message);
      this.emit('end');
    })
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(gulp.dest('www/build/css'))
});


/******************************************************************************
 * copy.fonts
 * Copy Ionic font files to build directory.
 ******************************************************************************/
gulp.task('copy.fonts', function() {
  return gulp.src(IONIC_DIR + 'fonts/**/*.+(ttf|woff|woff2)')
    .pipe(gulp.dest('www/build/fonts'));
});


/******************************************************************************
 * copy.html
 * Copy html files to build directory.
 ******************************************************************************/
gulp.task('copy.html', function(){
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('www/build'));
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
 * Bundle
 * Transpiles source files and bundles them into build directory using browserify.
 ******************************************************************************/
function bundleTask(watch, cb) {
  var b = browserify('./app/app.js', { cache: {}, packageCache: {} });

  function bundle() {
    var start = Date.now();
    return b.transform('babelify', {
        presets: ['es2015'],
        plugins: ['transform-decorators-legacy']
      })
      .bundle()
      .pipe(source('./app/app.js'))
      .pipe(rename('app.bundle.js'))
      .pipe(gulp.dest('www/build/js'))
      .on('end', function () {
        console.log('Build took ' + (Date.now() - start) + 'ms');
      });
  }

  if (watch) {
    b = watchify(b);
    b.on('update', bundle);
  }

  return bundle();
}


