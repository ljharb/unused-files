#!/usr/bin/env node

import pargs from 'pargs';

import unusedFiles from './index.mjs';

const {
	help,
	values: { json, ignorePattern },
} = await pargs(import.meta.filename, {
	options: {
		ignorePattern: {
			default: [
				'.github/**',
				'coverage/**',
				'test/**',
				'tests/**',
				'example/**',
			],
			description: 'Ignore files matching the given pattern',
			multiple: true,
			placeholder: 'pattern',
			type: 'string',
		},
		json: {
			default: false,
			description: 'Output the result as a JSON array',
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
