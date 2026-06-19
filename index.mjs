import { createRequire } from 'module';
import { dirname, join, relative } from 'path';
import { pathToFileURL } from 'url';

import micromatch from 'micromatch';

const require = createRequire(import.meta.url);

/*
 * knip only exports `main`; the option builder it relies on lives in an internal
 * module that knip's `exports` map hides from bare-specifier imports. Resolving
 * knip's entry point and importing the file directly bypasses that gate, since
 * the `exports` map only governs `knip/…` specifiers, not file URLs.
 */
const createOptionsURL = pathToFileURL(join(dirname(require.resolve('knip')), 'util', 'create-options.js')).href;

export default async function unusedFiles(
	cwd = process.cwd(),
	ignorePattern = [
		'.github/**',
		'coverage/**',
		'test/**',
		'tests/**',
		'example/**',
	],
) {
	// @ts-expect-error knip doesn't have main in its types
	const { main: knip } = await import('knip');
	const { createOptions } = await import(createOptionsURL);

	const options = await createOptions({
		cwd,
		includedIssueTypes: ['files'],
		isProduction: true,
		isStrict: true,
	});

	const { issues: { files } } = await knip(options);

	return Object.values(files)
		.flatMap((bySymbol) => Object.values(bySymbol))
		.flatMap((issue) => (
			micromatch.isMatch(relative(cwd, issue.filePath), ignorePattern)
				? []
				: `./${relative(cwd, issue.filePath)}`
		));
}
