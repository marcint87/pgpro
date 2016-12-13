var gulp = require("gulp"),
	$ = require("gulp-load-plugins")( {
		lazy: true
	}),
	// sass = require("gulp-sass"),
	// autoprefixer = require('gulp-autoprefixer'),
	// plumber = require('gulp-plumber'),
	browserSync = require('browser-sync').create(),
	del = require('del'),
	// useref = require('gulp-useref'),
	// uglify = require('gulp-uglify'),
	// gulpif = require('gulp-if'),
	// imagemin = require('gulp-imagemin'),
	runSequence = require('run-sequence'),
	ftp = require( 'vinyl-ftp' ),
	argv = require('yargs').argv;
	// gutil = require('gulp-util');

gulp.task('hello', function (){
	console.log("Hello!");
});

gulp.task('css', function(){

	$.util.log( $.util.colors.yellow("compiling Sass to Css..")   );
// zmienione : Sass.sync na Sass w pipe'ie
	return gulp.src('sass/main.scss')
		.pipe($.plumber())
		.pipe($.sass({
			outputStyle: 'expanded'
		}))
		.pipe( $.autoprefixer({
			browsers: ['last 2 versions', 'IE 9']
		}))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream() );
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


gulp.task("watch", function(){

	gulp.watch('sass/**/*.scss', ['css']);

	// gulp.watch("*.html").on("change", reload);
	gulp.watch("./*.html").on('change', browserSync.reload);
	gulp.watch("js/main.js").on('change', browserSync.reload);
});

gulp.task('clean', function(){

	return del('dist/*.*');


});

gulp.task('html', function(){

	gulp.src("./*.html")
		.pipe($.useref() )
		.pipe($.if( "*.js", $.uglify() ) )
		.pipe(gulp.dest('dist/') );
});

gulp.task('images', function(){

	return gulp.src("img/*", {
		base: 'dist'
	})
		.pipe($.imagemin())
		.pipe(gulp.dest('dist'));

});

gulp.task('copy', function(){
	return gulp.src( ['./css/*.css', './img/*', ], {
		base: "./"
	})
	.pipe(gulp.dest('dist/'));
});


gulp.task('upload', function(){

	var conn = ftp.create({
		host: '',
		user: '',
		password: '',
	});
	return gulp.src('dist/**/*')
				.pipe($.if(argv.upload, conn.dest('/public_html/')) );

});




gulp.task('build', function( cb){
	runSequence("clean", "html", "copy", "images","upload", cb);

});


gulp.task('build:server', ['build'] ,function(){


	browserSync.init({
		server: "dist/"
	});

});






gulp.task('default', ['css','server', 'watch']);
