var gulp = require('gulp');

var server = require('gulp-webserver');

var url = require('url');

var fs = require('fs');

var path = require('path');

var sass = require('gulp-sass');

var cleanCss = require('gulp-clean-css');

var concatCss = require('gulp-concat');

var uglify = require('gulp-uglify');


// //起服务
gulp.task('server', ['scss'], function() {
    gulp.src('src')
        .pipe(server({
            port: '8888',
            livereload: true,
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false;
                }
                pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
            }
        }))
});

//编译sass
gulp.task('scss', function() {
    gulp.src('./src/scss/*.css')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
});

//js
gulp.task('js', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('src/java'))
});

//监听
gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['scss'])
});

//开发环境
gulp.task('default', ['server', 'watch']);


gulp.task('buildScss', function() {
    gulp.src('./src/scss/*.css')
        .pipe(sass())
        .pipe(concatCss('all.css'))
        .pipe(gulp.dest('build/css'))
});

gulp.task('buildjs', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(concatCss('all.js'))
        .pipe(gulp.dest('build/java'))
});
//线上环境
gulp.task('build', ['buildScss', 'buildjs'])