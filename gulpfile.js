var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    gulp = require('gulp'),
    zip = require('gulp-zip'),
    nunjucksRender = require('gulp-nunjucks-render'),
    autoprefixer = require('gulp-autoprefixer'),
    // imagemin = require('gulp-imagemin'),
    // pngquant = require('imagemin-pngquant'),
    jshint = require('gulp-jshint'),
    critical = require('critical'),
    browserSync = require('browser-sync').create(),
    colors = require('colors');


var serverPath = '//CT360STOR/Kunden/Fritsch/Projekte/Website/Typo3/dev/';
gulp.task('webserver', ['build'], function() {
    // connect.server({
    //     livereload: true
    // });
});


gulp.task('browser-sync',['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('build'))
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}


gulp.task('sass', function () {
  return gulp.src('sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
      livereload.listen();
    gulp.watch('sass/*.scss', ['sass']);
    // gulp.watch('.Css/*.css', ['upload']);
    gulp.watch('js/*', ['html']);
    gulp.watch('img/*', ['html']);
    gulp.watch('build/*.html', ['html']);
    gulp.watch('templates/*.nunjucks', ['nunjucks']);
    gulp.watch('pages/*.nunjucks', ['nunjucks']);
});


gulp.task('html', function() {
    // gulp.src('index.html')
    //     .pipe(connect.reload());
    //livereload.reload('index.php');
    browserSync.reload('build/index.html');
});

gulp.task('css', function() {
    // gulp.src('css/*.css')
    //     .pipe(connect.reload());
});


gulp.task('jshint', function() {
    gulp.src('js/script.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload());
});

gulp.task('copy', function() {
    return gulp
        .src(['**/**'
        ])
        .pipe(gulp.dest(serverPath));
})


gulp.task('zip', function() {
    return gulp.src(['index.html',
            'css/**',
            'img/**',
            'js/**',
            'vendor/*',
            'fonts/**'
        ])
        .pipe(zip('apsensing.zip'))
        .pipe(gulp.dest('zip'));
});





gulp.task('deploy', ['zip'], function() {

    var conn = ftp.create({
        host: 'share.creative360.de',
        user: '86049-share',
        password: 'crb2b0812',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'src/**',
        'css/**',
        'js/**',
        'fonts/**',
        'img/**',
        'vendor/**',
        'bower_components/**',
        '*.html'
    ];

    // using reloadzse = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, {
            base: '.',
            buffer: false
        })
        .pipe(conn.newer('/fritsch')) // only upload newer files
        .pipe(conn.dest('/fritsch'));

});


gulp.task('upload', function() {

    var conn = ftp.create({
        host: 'fritschgroup.de',
        user: '497646-creative360',
        password: 'wWtRBFZ&v7&z',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        '.Css/**'
    ];

    // using reloadzse = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, {
            base: '.',
            buffer: false
        })
        .pipe(conn.newer('/webseiten/dev/typo3/typo3conf/fritsch_websitemodules')) // only upload newer files
        .pipe(conn.dest('/webseiten/dev/typo3/typo3conf/fritsch_websitemodules'));

});



gulp.task('jshint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

// gulp.task('build', ['sass', 'copy']);
gulp.task('build', ['sass']);

gulp.task('default', ['browser-sync', 'watch']);
