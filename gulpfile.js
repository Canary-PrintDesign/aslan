const fs = require('graceful-fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const mmq = require('gulp-merge-media-queries');
const csslint = require('gulp-csslint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const del = require('del');
const lineec = require('gulp-line-ending-corrector');
const hash = require('gulp-hash');
const awspublish = require('gulp-awspublish');

// Project related.
const project = 'aslan';
const projectURL = 'http://localhost:1313/';

// JS Vendor related.
const jsVendorSRC = 'src/js/vendor/*.js';
const jsVendorDestination = 'static/js';
const jsVendorFile = 'vendors';

// JS Custom related.
const jsCustomSRC = 'src/js/*.js';
const jsCustomDestination = 'static/js';
const jsCustomFile = 'custom';

// Images related.
const imagesSRC = 'src/images/**/*.{png,jpg,gif,svg}';  // Updated to include sub-folders
const imagesDestination = 'static/images/';

gulp.task("scss", function () {
  return del(["static/css/**/*"])
    .then(() => {
      return gulp.src("src/scss/**/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ["last 20 versions"] }))
        .pipe(hash())
        .pipe(mmq({ log: true }))
        .pipe(lineec())
        .pipe(gulp.dest("static/css"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/css"));
    });
});

gulp.task("images", function () {
  return del([imagesDestination])
    .then(() => {
      return gulp.src(imagesSRC)
        .pipe(imagemin({
          progressive: true,
          optimizationLevel: 3,
          interlaced: true,
          svgoPlugins: [{ removeViewBox: false }]
        }))
        .pipe(gulp.dest(imagesDestination));
    });
});

gulp.task('vendorsJs', function () {
  return del([jsVendorDestination])
    .then(() => {
      return gulp.src(jsVendorSRC)
        .pipe(concat(jsVendorFile + '.js'))
        .pipe(lineec())
        .pipe(hash())
        .pipe(gulp.dest(jsVendorDestination))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest(jsVendorDestination));
    });
});

gulp.task('customJS', function () {
  return del(['static/js/custom-*.js'])
    .then(() => {
      return gulp.src(jsCustomSRC)
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(lineec())
        .pipe(hash())
        .pipe(gulp.dest(jsCustomDestination))
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }))
        .pipe(jshint.reporter('fail'))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/js"));
    });
});

gulp.task('watch', function () {
  gulp.watch("src/scss/**/*", ['scss']);
  gulp.watch("src/images/**/*", ['images']);
  gulp.watch("layouts/**/*.html");
  gulp.watch(jsCustomSRC, ['customJS']);
});

gulp.task('default', ['scss', 'images', 'customJS', 'watch']);

gulp.task('publish', function () {
  const publisher = awspublish.create({
    region: 'ca-central-1',
    params: {
      Bucket: 'www.aslanventures.ca'
    }
  });
  const headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('public/**')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});
