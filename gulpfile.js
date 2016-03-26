var gulp      = require('gulp'),
    nodemon   = require('gulp-nodemon'),
    util      = require('gulp-util'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    browserify = require('browserify'),
    source    = require('vinyl-source-stream');
    
var buildProduction = util.env.production;

gulp.task('start', function(){
   nodemon({
       script:'app.js',
       ext:'js html',
       env:{'NODE_ENV':'development'},
    })
 });
 
// use for bundling: gulp build --dev or --production
gulp.task("build", function() {
   if (buildProduction) {
     gulp.start('production');
     
   } else {
     gulp.start('jsBrowserify');
   }
   
});
// concats all javascript files in public folder to one file
// and removes all white space.

gulp.task('concatInterface', function() {
    return  gulp.src(['./public/javascripts/*.js'])
            .pipe(concat('build.js'))
            .pipe(gulp.dest('./build/js'));
});

gulp.task('jsBrowserify', ['concatInterface'] , function() {
  return browserify({ entries: ['./build/js/build.js'] })
    .bundle()
    .pipe(source('build.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('production',["jsBrowserify"], function() {
    return  gulp.src(['./public/javascripts/*.js'])
            .pipe(concat('build.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./build/js'));
});

