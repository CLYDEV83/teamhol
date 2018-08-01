'use strict';

import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import gulp from 'gulp';
import rimraf from 'rimraf';
import webpack from 'webpack';
import named from 'vinyl-named';

// Load all Gulp plugins into one variable
const $ = plugins();

// Paths for SRC
const SRC = {
    styles: __dirname + '/UI/scss/',
    scripts: __dirname + '/UI/js/',
    images: __dirname + '/UI/img/',
    all: __dirname + '/UI/'
};

// Paths for DIST
const DIST = {
    styles: __dirname + '/wwwroot/Static/css/',
    scripts: __dirname + '/wwwroot/Static/js/',
    images: __dirname + '/wwwroot/Static/img/',
    all: __dirname + '/wwwroot/Static/'
};

gulp.task('js:es6:build', function (callback) {
    javascript({ minify: false }, callback);
});

gulp.task('js:es6:minify', function (callback) {
    javascript({ minify: true }, callback);
});

// Build the "dist" folder by running all of the below tasks
gulp.task('build', gulp.parallel(sass, 'js:es6:minify', images));

// Build the site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    rimraf(DIST.all, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
    return gulp.src(['UI/**/*', '!UI/{img,js,scss}/**/*'])
        .pipe(gulp.dest(DIST.all));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
    return gulp.src(SRC.styles + 'style.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: 'node_modules/foundation-sites/scss'
        })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'ios >= 7']
        }))
        .pipe($.cleanCss({ compatibility: 'ie9' }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST.styles));
}

// Use webpack 2 to compile/bundle/minify the js
function javascript(options, callback) {
    var plugins = options.minify ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false,
                semicolons: true
            },
            sourceMap: true
        })
    ] : [];

    webpack({
        cache: true,
        entry: SRC.scripts + 'app.js',
        devtool: 'source-map',
        plugins: plugins,
        output: {
            path: DIST.scripts,
            filename: 'app.js'
        },
        module: {
            loaders: [
                { loader: 'babel-loader', test: /\.js$/, query: { cacheDirectory: true, presets: ["es2015"] } },
                { loader: 'html-loader', test: /\.html$/ }
            ]
        }
    }, function (error, stats) {
        if (error) {
            var pluginError = new $.util.PluginError("webpack", error);
            if (callback) {
                callback(pluginError);
            } else {
                $.util.log("[webpack]", pluginError);
            }

            return;
        }
        $.util.log("[webpack]", stats.toString());
        if (callback) { callback(); }
    });
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
    return gulp.src(SRC.images + '**/*')
        .pipe($.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(DIST.images));
}

// Watch for changes to static assets
function watch() {
    gulp.watch(SRC.styles + '**/*.scss', gulp.parallel(sass));
    gulp.watch(SRC.images + '**/*', gulp.parallel(images));
    gulp.watch(SRC.scripts + '**/*', gulp.parallel('js:es6:build'));
}