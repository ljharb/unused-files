import test from 'tape';

import { join, relative } from 'path';
import { readFile, readdir } from 'fs/promises';

import unusedFiles from '../index.mjs';
import { spawnSync } from 'child_process';

const rootPath = join(import.meta.dirname, '..');
const fixtureDir = join(import.meta.dirname, 'fixtures');
const binPath = join(import.meta.dirname, '..', 'bin.mjs');

const help = (await readFile(join(rootPath, './help.txt'), 'utf8')).trim();

/** @typedef {{ status: number, stdout: string, stderr: string, files?: string[] }} Expected */

/** @type {(t: import('tape').Test, expected: Expected, cwd?: string, args?: string[]) => void} */
function testBin(t, expected, cwd = rootPath, args = []) {
	t.test(`./${relative(rootPath, cwd)} ${args.join(' ')}`, async (st) => {
		const { status, stdout, stderr } = spawnSync(process.execPath, [binPath, ...args], { cwd });

		st.deepEqual(
			{
				status,
				stdout: `${stdout}`.trim(),
				stderr: `${stderr}`.trim(),
				...expected.files && { files: expected.files },
			},
			expected,
			'got expected results',
		);
	});

	if (args.length === 0 && expected.files) {
		t.test(`./${relative(rootPath, cwd)} ${args.join(' ')} --json`, async (st) => {
			const { stdout } = spawnSync(process.execPath, [binPath, ...args, '--json'], { cwd });

			st.deepEqual(
				JSON.parse(`${stdout}`.trim()),
				expected.files,
				'got expected JSON results',
			);
		});

		t.test(`./${relative(rootPath, cwd)} ${args.join(' ')} --no-json`, async (st) => {
			const { stdout } = spawnSync(process.execPath, [binPath, ...args, '--no-json'], { cwd });

			st.deepEqual(
				`${stdout}`.trim(),
				// @ts-expect-error TS worries that this could be reassigned before this line. It can't.
				expected.files.join('\n'),
				'got expected non-JSON results',
			);
		});

		t.test(`unusedFiles(./${relative(rootPath, cwd)})`, async (st) => {
			const actual = await unusedFiles(cwd);
			st.deepEqual(actual, expected.files, 'got expected results');
		});
	}
}

test('unused-files', async (t) => {
	/** @type {{ args: string[], cwd?: string, expected: Expected }[]} */
	const testCases = [
		{
			args: ['--help'],
			expected: {
				status: 0,
				stdout: help,
				stderr: '',
			},
		},
		{
			args: ['--unknown'],
			expected: {
				status: 1,
				stdout: help,
				stderr: 'Error: Unknown option \'--unknown\'',
			},
		},
		{
			args: ['--ignorePattern'],
			expected: {
				status: 1,
				stdout: help,
				stderr: 'Error: Option \'--ignorePattern <value>\' argument missing',
			},
		},
		{
			args: ['positional'],
			expected: {
				status: 1,
				stdout: help,
				stderr: 'Error: Unexpected argument \'positional\'. This command does not take positional arguments',
			},
		},
		{
			args: ['--json', '--no-json'],
			expected: {
				status: 2,
				stdout: help,
				stderr: 'Error: Arguments --json and --no-json are mutually exclusive',
			},
		},
	].concat(await Promise.all((await readdir(fixtureDir)).map(async (fixture) => {
		const cwd = join(fixtureDir, fixture);
		return {
			cwd,
			args: [],
			expected: /** @type {Expected} */ (JSON.parse(await readFile(join(cwd, 'expected.json'), 'utf8'))),
		};
	})));

	testCases.forEach(({
		cwd,
		args,
		expected,
	}) => testBin(
		t,
		expected,
		cwd,
		args,
	));
});
