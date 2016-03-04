var gulp    = require('gulp'),
    nodemon = require('gulp-nodemon'),
    util   = require('gulp-util'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify');
    
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
     gulp.start('dev');
   }
   
});
// concats all javascript files in public folder to one file
// and removes all white space.

gulp.task('dev', function() {
    return  gulp.src(['./public/javascripts/*.js'])
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./public/build/js'));
});

gulp.task('production', function() {
    return  gulp.src(['./public/javascripts/*.js'])
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./public/build/js'));
});

