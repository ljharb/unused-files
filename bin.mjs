#!/usr/bin/env node

import pargs from 'pargs';

import unusedFiles from './index.mjs';

const {
	help,
	values: { json, ignorePattern },
} = await pargs(import.meta.filename, {
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

await help();

// eslint-disable-next-line no-extra-parens
const files = await unusedFiles(process.cwd(), /** @type {string[] | undefined} */ (ignorePattern));

if (json) {
	console.log(JSON.stringify(files, null, '\t'));
} else {
	files.forEach((x) => console.log(x));
}
