/**
 * 1 - Clean the distribution directory
 * 2 - Copy the files that are required for distribution
 *
 * var config = {
 * 	"destination": 	string 		distribution path
 * }
 */
var config = require('../config.json').dist;
var gulp   = require('gulp');
var clean  = require('gulp-clean'); 


gulp.task('clean', () => {
	return gulp.src(config.destination)
	.pipe(clean({force: true}));
});

gulp.task('dist', ['clean'], () => {
	// Config files
	gulp.src('config/**/*')
	.pipe(gulp.dest(config.destination + '/config'));

	// bin
	gulp.src('bin/**/*')
	.pipe(gulp.dest(config.destination + '/bin'));

	// App_api files
	gulp.src('app_api/**/*')
	.pipe(gulp.dest(config.destination + '/app_api'));
	
	// App_server
	gulp.src('app_server/**/*')
	.pipe(gulp.dest(config.destination + '/app_server'));

	// Root files
	gulp.src(['app.js', 'package.json', 'readme.txt'])
	.pipe(gulp.dest(config.destination));

	// Test files
	gulp.src('test/**/*')
	.pipe(gulp.dest(config.destination + '/test'));	
});