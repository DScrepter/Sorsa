import fs from 'fs';
import * as nodePath from 'path';

const getSassFiles = (dir) => {
	let results = [];
	const list = fs.readdirSync(dir);

	list.forEach((file) => {
		const filePath = nodePath.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat && stat.isDirectory()) {
			results = results.concat(getSassFiles(filePath));
		} else if (file.endsWith('.sass') && file.startsWith('_')) {
			results.push(filePath);
		}
	});

	return results;
};

export const generateSassImports = (done) => {
	try {
		const files = getSassFiles(app.path.src.sassFolder);
		const imports = files.map((file) => {
			const relativePath = nodePath.relative(nodePath.dirname(app.path.src.sass), file).replace(/\\/g, '/');
			return `@use "${relativePath}"`;
		}).join('\n');
		fs.writeFileSync(app.path.src.sass, imports);
	} catch (error) {
		console.error('Error generating SASS imports:', error);
	}
	return app.gulp.src(app.path.src.sassFolder);
};