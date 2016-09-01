'use strict';

// Require
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*', 'main-*'],
        replaceString: /\bgulp[\-.]/
    });

// Paths
var paths = {
    'dev': {
        'sass': './src/sass/',
        'js': './src/js/',
        'vendor': './src/vendor/',
        'images': './src/img/',
        'fonts': './src/fonts/',
        'audio': './src/audio/'
    },
    'production': {
        'css': './assets/css/',
        'js': './assets/js/',
        'fonts': './assets/fonts/',
        'images': './assets/img/',
        'audio': './assets/audio/'
    }
};

// VENDOR

gulp.task('vendor-fonts', function() {
    return gulp.src([
            'bower_components/font-awesome/fonts/fontawesome-webfont.*'
            // 'bower_components/Ionicons/fonts/ionicons.*'
        ])
        .pipe(plugins.newer(paths.production.fonts))
        .pipe(gulp.dest(paths.production.fonts));
});

gulp.task('vendor-js', function() {
    return gulp.src(plugins.mainBowerFiles('**/*.js'))
        .pipe(plugins.newer(paths.production.js))
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.production.js));
});

gulp.task('vendor-css', function() {
    return gulp.src(plugins.mainBowerFiles('**/*.{css,less}'))
        .pipe(plugins.newer(paths.production.css))
        .pipe(plugins.less())
        .pipe(plugins.sass())
        .pipe(plugins.concat('vendor.min.css'))
        .pipe(plugins.cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(paths.production.css));
});

// AUTHOR

gulp.task('css', function() {
    return gulp.src(paths.dev.sass + 'styles.scss')
        .pipe(plugins.newer(paths.production.css))
        .pipe(plugins.plumber(
            function(error) {
                console.log(error);
                this.emit('end');
            }
        ))
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.concat('author.min.css'))
        .pipe(gulp.dest(paths.production.css))
        .pipe(plugins.notify("CSS compilation successful!"));
});

gulp.task('js', function() {
    return gulp.src(paths.dev.js + '*.js')
        .pipe(plugins.plumber())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.production.js))
        .pipe(plugins.notify("JS compilation successful!"));
});

gulp.task('images', function() {
    return gulp.src(paths.dev.images + '*.{png,jpg,gif,svg}')
        .pipe(plugins.newer(paths.production.images))
        .pipe(plugins.imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.production.images))
        .pipe(plugins.notify({
            message: 'Images task complete',
            onLast: true
        }));
});

gulp.task('audio', function() {
    return gulp.src(paths.dev.audio + '*.{mp3,ogg}')
        .pipe(gulp.dest(paths.production.audio));
});

gulp.task('fonts', function() {
    return gulp.src(paths.dev.fonts + '**/*.{woff,woff2}')
        .pipe(plugins.newer(paths.production.fonts))
        .pipe(gulp.dest(paths.production.fonts));
});

gulp.task('watch', function() {
    gulp.watch('src/sass/*.scss', ['css']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/img/*.{png,jpg,gif}', ['images']);
    gulp.watch('./src/fonts/*.{woff,svg,ttf,eot}', ['fonts']);
});

gulp.task('default', ['vendor-js', 'css', 'js', 'images', 'fonts']);
