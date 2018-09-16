const gulp         = require('gulp'), // Підключаємо Gulp
	  sass         = require('gulp-sass'), //Підключаємо Sass пакет,
	  browserSync  = require('browser-sync'), // Підключаємо Browser Sync
	  concat       = require('gulp-concat'), // Підключаємо gulp-concat (для конкатенації файлів)
	  uglify       = require('gulp-uglifyjs'), // Підключаємо gulp-uglifyjs (для стиснення JS)
	  cssnano      = require('gulp-cssnano'), // Підключаємо пакет для мініфікації CSS
	  rename       = require('gulp-rename'), // Підключаємо бібліотеку для зміни імені файлів
	  del          = require('del'), // Підключаємо бібліотеку для видалення файлів і папок
	  cache        = require('gulp-cache'), // Підключаємо бібліотеку кешування
	  autoprefixer = require('gulp-autoprefixer');// Підключаємо бібліотеку для автоматичного додавання префіксів

gulp.task('sass', function(){ // Створюємо таск Sass
	return gulp.src('app/sass/**/*.sass') // Беремо джерело
		.pipe(sass()) // Перетворюємо Sass в CSS за допомогою gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Створюємо префікси
		.pipe(gulp.dest('app/css')) // Вигружаемо результат в папку app/css
		.pipe(browserSync.reload({stream: true})) // Оновлюємо CSS на сторінці при зміні
});

gulp.task('browser-sync', function() { // Створюємо таск browser-sync
	browserSync({ // Виконуємо browserSync
		server: { // Визначаємо параметри сервера
			baseDir: 'app' // Директорія для сервера - app
		},
		notify: false // Відключаємо сповіщення
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Беремо всі необхідні бібліотеки
		'app/libs/jquery/dist/jquery.min.js', // Беремо jQuery
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Беремо Magnific Popup
		])
		.pipe(concat('libs.min.js')) // Збираємо їх до купи у новому файлі libs.min.js
		.pipe(uglify()) // Зжимаемо JS файл
		.pipe(gulp.dest('app/js')); // Вивантажуємо в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css') // Вибираємо файл для мініфікації
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суфікс .min
		.pipe(gulp.dest('app/css')); // Вивантажуємо в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); // Спостереження за sass файлами в папці sass
	gulp.watch('app/*.html', browserSync.reload); // Спостереження за HTML файлами в корні проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Спостереження за JS файлами в папці js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Видаляємо папку dist перед зборкою
});

gulp.task('build', ['clean', 'sass', 'scripts'], function() {

	const buildCss = gulp.src([ // Переносим бібліотеки в продакшен
		'app/css/index.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	const buildFonts = gulp.src('app/fonts/**/*') // Переносимо шрифти в продакшен
	.pipe(gulp.dest('dist/fonts'))

	const buildJs = gulp.src('app/js/**/*') // Переносимо скрипти в продакшен
	.pipe(gulp.dest('dist/js'))

	const buildHtml = gulp.src('app/*.html') // Переносимо HTML в продакшен
	.pipe(gulp.dest('dist'));
	const buildImg = gulp.src('app/img/**/*') // Переносимо img в продакшен
	.pipe(gulp.dest('dist/img'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
