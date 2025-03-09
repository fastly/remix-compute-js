# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

## [4.1.0] - 2025-03-10

### Added

- Defined a LoadContext type
- We now pass and object into the loader context based on the fetch event.

## [4.0.2] - 2025-03-08

### Fixed

- Fixed type reference in typescript d.ts file
- Update to mirror starter kit

## [4.0.1] - 2025-01-06

### Added

- Release to npmjs using CI workflow

### Fixed

- Updated dependency versions

## [4.0.0] - 2024-01-26

### Updated

- Supports remix@2, and drops remix@1
- Uses @fastly/compute-js-static-publish@6 to cleanly separate static manifest files

## [3.0.0] - 2024-01-26

### Updated

- Use SubtleCrypto from JS SDK for cookie signing
- Remove Webpack and crypto polyfill from template
- Template now uses "type": "module"
- Update Migration steps

### Fixed

- fix: specify full file path in file reference for use in projects with "type": "module"
- fix: rename .eslintrc config to cjs

## [2.1.1] - 2023-12-01

### Updated

- fix: Specify dependency of @fastly/compute-js-static-publish@^5.1.2,
    which allows peerDependency of js-compute@3

## [2.1.0] - 2023-11-14

### Added

- Allow async `getLoadContext()` function

### Updated

- Update to @fastly/js-compute@3
- Apply "Compute" branding change.

## [2.0.2] - 2023-06-27

### Fixed

- fix: Fix AbortController stub method names

## [2.0.1] - 2023-06-27

### Fixed

- fix: Create Project command in README was missing `--` before flags passed to `create-remix`

## [2.0.0] - 2023-06-19

### Updated

- Update to @fastly/js-compute@2
- Update to @fastly/compute-js-static-publish@5
- Update to typescript@5

## [1.0.0]

- Initial official release

[unreleased]: https://github.com/fastly/remix-compute-js/compare/v4.1.0...HEAD
[4.1.0]: https://github.com/fastly/remix-compute-js/compare/v4.0.2...v4.1.0
[4.0.2]: https://github.com/fastly/remix-compute-js/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/fastly/remix-compute-js/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/fastly/remix-compute-js/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/fastly/remix-compute-js/compare/v2.1.0...v3.0.0
[2.1.1]: https://github.com/fastly/remix-compute-js/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/fastly/remix-compute-js/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/fastly/remix-compute-js/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/fastly/remix-compute-js/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/fastly/remix-compute-js/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/fastly/remix-compute-js/releases/tag/v1.0.0
