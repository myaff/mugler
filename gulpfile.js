"use strict";

const gulp = require('gulp');
const gulpIf = require('gulp-if');
//const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-minify-css');
const prefixer = require('gulp-autoprefixer');
//const rigger = require('gulp-rigger');
const del = require('del');
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const webpackStream = require("webpack-stream");
const webpack = webpackStream.webpack;
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
//const sassdoc = require('sassdoc');
const svg = require('gulp-svg-sprite');
const svg2string = require('gulp-svg2string');
const uglify = require('gulp-uglify');
const jade = require('gulp-jade');
const data = require('gulp-data');
const fs = require('fs');
const stylus = require('gulp-stylus');
//const debug = require('gulp-debug');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const path = {
    build: {
        js: 'build/js/',
        jsVendor: 'build/js/vendor/',
        css: 'build/css/',
        assets: 'build/assets/',
        img: 'build/img',
        html: './'
    },
    src: {
        js: 'src/js/main.js',
        jsVendor: 'src/js/vendor/**/*.js',
        css: 'src/styl/main.styl',
        assets: 'src/assets/**',
        svg: 'src/svg/*.svg',
        img: ['src/images/**/*.*', '!src/images/**/*-min.*', '!src/images/**/*.zip'],
        imgMin: 'src/images/**/*-min.*',
        html: 'src/jade/**/*.jade'
    },
    watch: {
        js: 'src/js/components/*.js',
        css: 'src/styl/**/*.styl',
        assets: 'src/assets/**',
        svg: 'src/svg/*.svg',
        img: 'src/images/**/*.*',
        jade: 'src/jade/**/*.jade',
        html: ['build/**/*.*', '*.html', '**/*.html', '*.php', '**/*.php']
    },
    clean: './build'
};

gulp.task('clean', function () {
    return del(path.clean);
});

gulp.task('assets:build', function () {
    return gulp.src(path.src.assets/*, {since: gulp.lastRun('assets:build')}*/)
        .pipe(newer(path.build.assets))
        .pipe(gulp.dest(path.build.assets));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.jsVendor)
        .pipe(gulp.dest(path.build.jsVendor));
});

gulp.task('css:build', function () {
    return gulp.src(path.src.css)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        // .pipe(sass())
        .pipe(stylus())
        .on('error', notify.onError())
        .pipe(prefixer({ browsers: '> 1%'}))
		//.pipe(postcss([require('postcss-flexbugs-fixes')]))
        .pipe(gulpIf(!isDevelopment, cssmin()))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:minify', function(){
	return gulp.src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5})
		]))
        .pipe(gulp.dest(path.build.img));
});
gulp.task('image:minified', function(){
	return gulp.src(path.src.imgMin)
		.pipe(newer(path.build.img))
		.pipe(rename(function(opt){
			opt.basename = opt.basename.replace(/-min/, '');
			return opt;
		}))
		.pipe(gulp.dest(path.build.img));
});
gulp.task('image:build', gulp.parallel('image:minify', 'image:minified'));

gulp.task('svg:build', function(){
    var svgConfig = {
        shape: {
            dimension: {
                maxWidth: 30,
                maxHeight: 30
            },
            spacing: {
                padding: 0
            },
            transform: ['svgo']
        },
        svg: {
            xmlDeclaration      : false,
            doctypeDeclaration  : false
        },
        mode: {
            css: false,
            view: false,
            defs: false,
            stack: false,
            symbol: {
                dest: 'svg',
                sprite: 'sprite.svg',
                bust: false,
                example: true
            }
        }
    };
    return gulp.src(path.src.svg)
        .pipe(svg(svgConfig))
        .pipe(gulp.dest(path.build.img))
        .pipe(svg2string())
        .pipe(gulp.dest(path.build.img));
});

gulp.task('webpack', function(callback){
    let firstBuildReady = false;

    function done(err, stats) {
        firstBuildReady = true;
        if (err) return;
        console.log(stats.toString());
    }
    
    let options = {
        context: __dirname + '/src/js',
        entry: {
            main: `./main`
        },
        output: {
            path: __dirname + '/build/js',
            publicPath: (isDevelopment ? '/calvin-klein/build/js/' : '/html/build/js/'),
            libraryTarget: 'var',
            library: "Main",
            filename: "[name].js"
        },
        watch: isDevelopment,
        devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
        module:  {
            loaders: [{
                test:    /\.js$/,
                include: __dirname + "/src",
                loader:  'babel?presets[]=es2015'
            }]
        },
        plugins: [
            new webpack.NoErrorsPlugin()
        ]
    };

    return gulp.src(path.src.js)
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(webpackStream(options, null, done))
        .pipe(gulpIf(!isDevelopment, uglify()))
        .pipe(gulp.dest(path.build.js))
        .on('data', function() {
            callback();
        });
		
});

gulp.task('sassdoc', function () {
    var options = {
        dest: 'docs/styles',
        verbose: true
    };

    return gulp.src([path.watch.css, '!src/css/components/material/**/*.scss'])
        //.pipe(debug({title: 'unicorn:'}))
        .pipe(sassdoc(options));
});

gulp.task('jade', function () {
  var dataFile = 'src/data/data.json';
  return gulp.src(path.src.html)
      .pipe(data(function(file){
        return JSON.parse(fs.readFileSync(dataFile));
      }))
      .pipe(jade({
      //  compileDebug: false,
        pretty: true
      }))
      .pipe(gulp.dest(path.build.html));
});

gulp.task('build', gulp.parallel('css:build', 'assets:build', 'svg:build', 'js:build', 'image:build', 'webpack', 'jade'));

gulp.task('webserver', function(){
     browserSync.init({
        //proxy: "localhost/loccitane/",
        //host: 'localhost',
        //port: 7000,
        server: './'
    });

    //browserSync.watch(path.watch.html).on('change', browserSync.reload);
    browserSync.watch(path.watch.css).on('change', browserSync.reload);
    browserSync.watch(path.watch.jade).on('change', browserSync.reload);
});

gulp.task('watch', function(){
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.assets, gulp.series('assets:build'));
    gulp.watch(path.watch.svg, gulp.series('svg:build'));
    gulp.watch(path.watch.jade, gulp.series('jade'));
    gulp.watch(path.watch.js, gulp.series('webpack'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
});

gulp.task('default', gulpIf(isDevelopment,
    gulp.series('build', gulp.parallel('watch', 'webserver')),
    gulp.series('clean', 'build'))
);