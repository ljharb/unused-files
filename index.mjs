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
			cacheLocation: '',
			cwd,
			excludedIssueTypes: [],
			fixTypes: [],
			gitignore: true,
			includedIssueTypes: [],
			isCache: false,
			isDebug: false,
			isDependenciesShorthand: false,
			isExportsShorthand: false,
			isFilesShorthand: false,
			isFix: false,
			isFormat: false,
			isIncludeEntryExports: true,
			isIncludeLibs: true,
			isIsolateWorkspaces: false,
			isProduction: true,
			isRemoveFiles: false,
			isShowProgress: false,
			isStrict: true,
			isWatch: false,
			tags: [[], []],
			tsConfigFile: '',
			workspace: undefined,
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
