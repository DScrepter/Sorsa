// Основной модуль
import gulp from "gulp";
// Импорт путей
import { path } from "./gulp/config/path.js";

// Импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";
import debounce from 'lodash.debounce';

import chokidar from 'chokidar';
// Передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
	path: path,
	gulp: gulp,
	plugins: plugins
}

// Импорт задач
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { generateSassImports } from "./gulp/tasks/sassImport.js";
import { sas } from "./gulp/tasks/sass.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprite } from "./gulp/tasks/svgSprite.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

// Наблюдатель за изменениями в файлах
function watcher() {
	const sassWatcher = chokidar.watch(
		path.watch.sass,
		{
			ignored: path.src.sass,
			persistent: true,
		}
	);
	sassWatcher.on('all', (event, path) => {
		if (['add', 'unlink'].includes(event)) {
			generateSassImports();
		}
	});
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html); // если нужно выгружать на сервер gulp.series(html, ftp)
	gulp.watch(path.watch.sass, sas);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);


}

export { svgSprite }
// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, generateSassImports, sas, js, images));

// Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// Экспорт сценариев
export { dev }
export { build }
export { deployZIP }
export { deployFTP }

// Выполнение сценариев по умолчанию
gulp.task('default', dev);