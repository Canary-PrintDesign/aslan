/**
 * Gulpfile.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in HTML.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *
 * @author Kirsten Dodd (@kirstenjvd)
 */

// Project related.
var project                 = 'aslan'; // Project Name.
var projectURL              = 'http://localhost:1313/';

// JS Vendor related.
var jsVendorSRC             = 'src/js/vendor/*.js'; // Path to JS vendor folder.
var jsVendorDestination     = 'static/js'; // Path to place the compiled JS vendors file.
var jsVendorFile            = 'vendors'; // Compiled JS vendors file name.
// Default set to vendors i.e. vendors.js.

// JS Custom related.
var jsCustomSRC             = 'src/js/*.js'; // Path to JS custom scripts folder.
var jsCustomDestination     = 'static/js'; // Path to place the compiled JS custom scripts file.
var jsCustomFile            = 'custom'; // Compiled JS custom file name.
// Default set to custom i.e. custom.js.

// Images related.
var imagesSRC               = 'src/images/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination       = 'static/images/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.



var gulp         = require("gulp");

// CSS related plugins.
var sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    mmq          = require('gulp-merge-media-queries'),
    csslint      = require('gulp-csslint');

// JS related plugins.
var concat       = require('gulp-concat'), // Concatenates JS files
    uglify       = require('gulp-uglify'), // Minifies JS files
    jshint       = require('gulp-jshint');

// Image realted plugins.
var imagemin     = require('gulp-imagemin');

// Utility related plugins.
var del          = require("del"),
    // hash         = require("gulp-hash"),
    lineec       = require('gulp-line-ending-corrector'),
    notify       = require('gulp-notify'),
    // browserSync  = require('browser-sync').create(),
    // reload       = browserSync.reload,
    del          = require("del"),
    hash         = require("gulp-hash");

var awspublish = require('gulp-awspublish');

// gulp.task( 'browser-sync', function() {
//   browserSync.init( {

//     // Project URL.
//     proxy: projectURL,
//     open: true,
//     injectChanges: true,

//   } );
// });

// Compile SCSS files to CSS
gulp.task("scss", function () {
  del(["static/css/**/*"])
  gulp.src("src/scss/**/*.scss")
    .pipe(sass({outputStyle : "compressed"}))
    .pipe(autoprefixer({browsers : ["last 20 versions"]}))
    // .pipe(csslint())
    // .pipe(csslint.formatter())
    .pipe(hash())
    .pipe( mmq( { log: true } ) )
    .pipe( lineec() )
    .pipe(gulp.dest("static/css"))
    .pipe(hash.manifest("hash.json"))
    .pipe(gulp.dest("data/css"))
    // .pipe( browserSync.stream() )
    .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
})

// Hash images
gulp.task("images", function () {
  del([imagesDestination])
  gulp.src(imagesSRC)
    .pipe( imagemin( {
      progressive: true,
      optimizationLevel: 3,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}]
    } ) )
    .pipe(gulp.dest(imagesDestination))
    .pipe( notify( { message: 'TASK: "images" Completed! 💯', onLast: true } ) );

})

// Hash javascript
gulp.task( 'vendorsJs', function() {
  del([jsVendorDestination])
  gulp.src( jsVendorSRC )
    .pipe( concat( jsVendorFile + '.js' ) )
    .pipe( lineec() )
    .pipe(hash())
    .pipe( gulp.dest( jsVendorDestination ) )
    .pipe( uglify() )
    .pipe( lineec() )
    .pipe(hash.manifest("hash.json"))
    .pipe( gulp.dest( jsVendorDestination ) )
    .pipe( notify( { message: 'TASK: "vendorsJs" Completed! 💯', onLast: true } ) );
 });

 gulp.task( 'customJS', function() {
    del([jsCustomDestination])
    gulp.src( jsCustomSRC )
    .pipe( concat( jsCustomFile + '.js' ) )
    .pipe( lineec() )
    .pipe(hash())
    .pipe( gulp.dest( jsCustomDestination ) )
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }))
    .pipe(jshint.reporter('fail'))
    .pipe( uglify() )
    .pipe( lineec() )
    .pipe(hash.manifest("hash.json"))
    .pipe( gulp.dest("data/js") )
    .pipe( notify( { message: 'TASK: "customJs" Completed! 💯', onLast: true } ) );
 });

// Watch asset folder for changes
gulp.task("default", ["scss", "images", "customJS"], function () {
  gulp.watch("src/scss/**/*", ["scss"])
  gulp.watch("src/images/**/*", ["images"])
  gulp.watch( "layouts/**/*.html" );
  // gulp.watch( jsVendorSRC, [ 'vendorsJs' ] );
  gulp.watch( jsCustomSRC, [ 'customJS' ] );
});

// Publish to AWS S3
gulp.task('publish', function() {
  var publisher = awspublish.create({
    region: 'ca-central-1',
    params: {
      Bucket: 'aslan.canaryprint.ca'
    }
  });
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('public/**')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});
