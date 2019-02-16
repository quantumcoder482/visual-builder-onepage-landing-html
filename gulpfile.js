'use strict';

/*
 * MEDIATEC
 */

/////////////////////////////////////////////////////////////////////////////
// GULP PLUGINS

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    ignore = require('gulp-ignore'),
    rimraf = require('gulp-rimraf'),
    server = require("browser-sync"),
    template = require('gulp-template'),
    reload = server.reload,
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    mqpacker = require('css-mqpacker'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    run = require('run-sequence');

/////////////////////////////////////////////////////////////////////////////
// GULP PATHS

var path = {
    src: {
        sites: 'src/sites/**/*.html',
        templates: 'src/templates/**/*.html',
        css: 'src/assets/css/main.scss',
        js: 'src/assets/js/**/*.*',
        img: ['src/assets/img/**/*.*', '!src/assets/svg/**/*.*'],
        svg: 'src/assets/img/svg/*.svg',
        svg_sprite: 'src/assets/img/svg/sprite/*.svg',
        fonts: 'src/assets/fonts/**/*.{ttf,woff,woff2,eot,svg}',
        vendors_by_bower: 'src/assets/vendors/by_bower/**/*.*',
        vendors_by_hands: 'src/assets/vendors/by_hands/**/*.*'
    },

    build: {
        sites: 'dist/sites/',
        css: 'dist/assets/css/',
        js: 'dist/assets/js/',
        img: 'dist/assets/img/',
        svg: 'dist/assets/img/svg/',
        fonts: 'dist/assets/fonts/',
        vendors: 'dist/assets/vendors/'
    },

    watch: {
        sites: 'src/sites/**/*.*',
        templates: 'src/templates/**/*.html',
        css: 'src/assets/css/**/*.*',
        js: 'src/assets/js/**/*.*',
        img: 'src/assets/img/**/*.*',
        svg: 'src/assets/img/svg/*.svg',
        svg_sprite: 'src/assets/img/svg/sprite/*.svg',
        fonts: 'src/assets/fonts/**/*.{ttf,woff,woff2,eot,svg}',
        vendors_by_bower: 'src/assets/vendors/by_bower/**/*.*',
        vendors_by_hands: 'src/assets/vendors/by_hands/**/*.*'
    },

    clean: ['dist/*']
};

/////////////////////////////////////////////////////////////////////////////
// PRINT ERRORS

function printError(error) {
    console.log(error.toString()); // print error
    this.emit('end'); // end task
}

/////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVER
gulp.task('run:server', function () {
    server.init({
        server: {
            baseDir: "./dist/", // base dir path
            directory: true // show as directory
        },
        tunnel: false, // tunnel
        host: 'localhost', // host
        port: 9000, // port
        logPrefix: "frontend", // console log prefix
        files: ['./dist/**/*'], // files path for changes watcher
        watchTask: true // watcher on/off
    });
});

/////////////////////////////////////////////////////////////////////////////
// VENDORS BUILD
gulp.task('build:vendors', function() {
    return gulp.src([path.src.vendors_by_bower, path.src.vendors_by_hands]) // get folders with vendors components
    .pipe(plumber()) //error catcher
    .pipe(gulp.dest(path.build.vendors)); // copy to destination folder
});

/////////////////////////////////////////////////////////////////////////////
// BUILD STRUCTURE
gulp.task('build:structure', function () {
    gulp.src(path.src.sites) // get sites
    .pipe(plumber()) //error catcher
    .pipe(rigger()) // include component templates to generated pages
    .pipe(template()) // replace DATA variables
    .on('error', printError) // print error if found
    .pipe(gulp.dest(path.build.sites)) // copy generated pages to build folder
    .pipe(reload({stream: true})); // reload BrowserSync
});

/////////////////////////////////////////////////////////////////////////////
// STYLES BUILD
gulp.task('build:css', function () {
    setTimeout(function() {
        return gulp.src(path.src.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            indentWidth: 4
        }))
        .on('error', printError) // print error if found
        .pipe(prefixer({
            browsers: [
            'last 1 version',
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Opera versions',
            'last 2 Edge versions'
            ]
        }))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.build.css))
        .pipe(server.reload({stream: true}));
    }, 600);
});

/////////////////////////////////////////////////////////////////////////////
// FONTS BUILD
gulp.task('build:fonts', function() {
    return gulp.src(path.src.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// IMAGES BUILD
gulp.task('build:img', function() {
    return gulp.src(path.src.img)
    .pipe(plumber())
    .on('error', printError) // print error if found
    .pipe(imagemin([
        imagemin.optipng({
            optimizationLevel: 3
        }),
        imagemin.jpegtran({
            progressive: true
        })
        ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(server.reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// SVG BUILD
gulp.task('build:svg', function() {
    return gulp.src(path.src.svg)
    .pipe(svgmin(function(file) {
        return {
            plugins: [{
                removeDoctype: true
            }, {
                removeComments: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
                convertColors: {
                    names2hex: true,
                    rgb2hex: true
                }
            }, {
                cleanupIDs: {
                    minify: true
                }
            }]
        }
    }))
    .pipe(cheerio({
        run: function($) {
            $('svg').attr('width', null).attr('height', null);
        },
        parserOptions: {
            xmlMode: true
        }
    }))
    .pipe(gulp.dest(path.build.svg))
    .pipe(reload({
        stream: true
    }));
});


/////////////////////////////////////////////////////////////////////////////
// SVG SPRITES BUILD
gulp.task('build:svg_sprite', function() {
    return gulp.src(path.src.svg_sprite)
    .pipe(plumber())
    .pipe(svgmin(function(file) {
        return {
            plugins: [{
                removeDoctype: true
            }, {
                removeComments: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
                convertColors: {
                    names2hex: true,
                    rgb2hex: true
                }
            }, {
                cleanupIDs: {
                    minify: true
                }
            }]
        }
    }))
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(cheerio({
        run: function($) {
            $('svg').attr('style', 'display: none').attr('width', null).attr('height', null);
        },
        parserOptions: {
            xmlMode: true
        }
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(path.build.svg))
    .pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT BUILD
gulp.task('build:js', function() {
    return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename('common.min.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(server.reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// GLOBAL BUILD
gulp.task('build', function(fn) {
    run('build:structure', // run build:html task
    'build:fonts', // run build:fonts task
    'build:css', // run build:css task
    'build:js', // run build:js task
    'build:img', // run build:img task
    'build:svg', // run build:svg task
    'build:svg_sprite', // run build:svg_sprite task
    'build:vendors', // run build:vendors task,
    fn);
});

/////////////////////////////////////////////////////////////////////////////
// FILES CHANGE WATCHER
gulp.task('watch', function(){
    watch([path.watch.sites, path.watch.templates], function(event, cb) { // watch sites folders
        gulp.start('build:structure'); // run build:structure task
    });
    watch([path.watch.css], function(event, cb) { // watch css folder
        gulp.start('build:css'); // run build:css task
    });
    watch([path.watch.js], function(event, cb) { // watch js folder
        gulp.start('build:js'); // run build:js task
    });
    watch([path.watch.img], function(event, cb) { // watch img folder
        gulp.start('build:img'); // run build:img task
    });
    watch([path.watch.svg], function(event, cb) { // watch svg folder
        gulp.start('build:svg'); // run build:svg task
    });
    watch([path.watch.svg_sprite], function(event, cb) { // watch svg-sprite folder
        gulp.start('build:svg_sprite'); // run build:svg_sprite
    });
    watch([path.watch.fonts], function(event, cb) { // watch fonts folder
        gulp.start('build:fonts'); // run build:fonts task
    });
    watch([path.watch.vendors_by_bower, path.watch.vendors_by_hands], function(event, cb) { // watch folder with vendors components
        gulp.start('build:vendors'); // run build:vendors task
    });
});

/////////////////////////////////////////////////////////////////////////////
// CLEAN PRODUCTION
gulp.task('clean', function () {
    return gulp.src(path.clean) // get build folder
    .pipe(rimraf()); // erase all
});

/////////////////////////////////////////////////////////////////////////////
// DEFAULT TASK
gulp.task('default', function(fn) {
    run('build', 'watch', 'run:server', fn)
});
