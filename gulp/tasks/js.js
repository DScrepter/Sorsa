import webpack from "webpack-stream";
import { glob } from 'glob';
import path from 'path';

export const js = () => {
	// Получаем список всех JS файлов в корневой папке js
	const entries = {};
	glob.sync('./src/js/*.js').forEach(file => {
		const name = path.basename(file, '.js');
		entries[name] = './' + file;
	});

	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: 'Error: <%= error.message %>'
			})
		))
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			entry: entries,
			output: {
				filename: '[name].min.js',
			}
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browserSync.stream());
}