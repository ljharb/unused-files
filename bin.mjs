#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { join } from 'path';

import unusedFiles from './index.mjs';

import pargs from './pargs.mjs';

const help = await readFile(join(import.meta.dirname, './help.txt'), 'utf8');

const { values: { json, ignorePattern } } = pargs(help, import.meta.filename, {
	options: {
		ignorePattern: {
			default: undefined,
			multiple: true,
			type: 'string',
		},
		json: {
			default: false,
			type: 'boolean',
		},
	},
});

// eslint-disable-next-line no-extra-parens
const files = await unusedFiles(process.cwd(), /** @type {string[] | undefined} */ (ignorePattern));

if (json) {
	console.log(JSON.stringify(files, null, '\t'));
} else {
	files.forEach((x) => console.log(x));
}
