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
		// @ts-expect-error knip doesn't have `main` in its types
		const { main: knip } = await import('knip');

		({ issues: { files } } = await knip({
			cacheLocation: '',
			config: undefined,
			configFilePath: undefined,
			cwd,
			dependencies: true,
			experimentalTags: [[], []],
			exports: true,
			files: false,
			fixTypes: [],
			gitignore: true,
			includedIssueTypes: {
				_files: true,
				binaries: true,
				classMembers: true,
				dependencies: true,
				devDependencies: true,
				duplicates: true,
				enumMembers: true,
				exports: true,
				files: true,
				nsExports: true,
				nsTypes: true,
				optionalPeerDependencies: true,
				types: true,
				unlisted: true,
				unresolved: true,
			},
			isCache: false,
			isDebug: false,
			isDisableConfigHints: false,
			isFix: false,
			isFixDependencies: false,
			isFixFiles: false,
			isFixUnusedExports: false,
			isFixUnusedTypes: false,
			isFormat: false,
			isIncludeEntryExports: true,
			isIsolateWorkspaces: false,
			isProduction: true,
			isReportClassMembers: false,
			isReportDependencies: false,
			isReportTypes: false,
			isReportValues: false,
			isShowProgress: false,
			isSkipLibs: false,
			isStrict: true,
			isTrace: false,
			isTreatConfigHintsAsErrors: false,
			isWatch: false,
			parsedConfig: {},
			rules: {
				_files: 'error',
				binaries: 'error',
				classMembers: 'error',
				dependencies: 'error',
				devDependencies: 'error',
				duplicates: 'error',
				enumMembers: 'error',
				exports: 'error',
				files: 'error',
				nsExports: 'error',
				nsTypes: 'error',
				optionalPeerDependencies: 'error',
				types: 'error',
				unlisted: 'error',
				unresolved: 'error',
			},
			tags: [[], []],
			traceExport: undefined,
			traceFile: undefined,
			tsConfigFile: '',
			workspace: undefined,
			workspaces: [],
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
