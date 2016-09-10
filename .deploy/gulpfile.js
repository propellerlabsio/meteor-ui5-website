// npm install --save-dev gulp-ui5-preload gulp-uglify gulp-pretty-data gulp-if
var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');

gulp.task('ui5preload', function(){
  return gulp
    .src([
      '../public/webapp/**/**.+(js|xml)',
      '!../public/webapp/Component-preload.js',
      '!../public/webapp/lib/**' 
    ])
    // .src(['../public/webapp/**/**.+(js)'])
    .pipe(gulpif('**/*.js',babel({
            presets: ['es2015']
        })))
    .pipe(gulpif('**/*.js',uglify()))    //only pass .js files to uglify
    .pipe(gulpif('**/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata 
    .pipe(ui5preload({base:'../public/webapp',namespace:'meteor-ui5-website'}))
    .pipe(gulp.dest('../public/webapp'));
});