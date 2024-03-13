# @ljharb/unused-files <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

List unused files in your package.

## Usage

```sh
npx @ljharb/unused-files # if not installed

unused-files # if installed and in the PATH
```

```sh
$ unused-files --help
Usage: unused-files [options]

Options:
  --ignorePattern <pattern>  Ignore files matching the given pattern
    [string]
    [multiple]
    [default: .github/**, coverage/**, test/**, tests/**, example/**]

  --json                     Output the result as a JSON array
    [boolean]
    [default: false]
```

## Install

```
npm install --save-dev @ljharb/unused-files
```

## License

MIT

[package-url]: https://npmjs.org/package/@ljharb/unused-files
[npm-version-svg]: https://versionbadg.es/ljharb/unused-files.svg
[deps-svg]: https://david-dm.org/ljharb/unused-files.svg
[deps-url]: https://david-dm.org/ljharb/unused-files
[dev-deps-svg]: https://david-dm.org/ljharb/unused-files/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/unused-files#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/@ljharb/unused-files.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/@ljharb/unused-files.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/@ljharb/unused-files.svg
[downloads-url]: https://npm-stat.com/charts.html?package=@ljharb/unused-files
[codecov-image]: https://codecov.io/gh/ljharb/unused-files/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/unused-files/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/unused-files
[actions-url]: https://github.com/ljharb/unused-files/actions
