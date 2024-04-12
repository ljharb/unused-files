import { relative } from 'path';
import micromatch from 'micromatch';

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
	const origArgv = process.argv;
	let files;
	try {
		process.argv = origArgv.slice(0, 2);
		const { main: knip } = await import('knip');

		({ issues: { files } } = await knip({
			cwd,
			fixTypes: [],
			gitignore: true,
			isFix: false,
			isIncludeEntryExports: true,
			isIncludeLibs: true,
			isIsolateWorkspaces: false,
			isProduction: true,
			isShowProgress: false,
			isStrict: true,
			tags: [[], []],
		}));
	} finally {
		process.argv = origArgv;
	}

	return Array.from(files).flatMap((x) => (
		micromatch.isMatch(relative(cwd, x), ignorePattern)
			? []
			: `./${relative(cwd, x)}`
	));
}
