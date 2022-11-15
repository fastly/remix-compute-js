# Remix Adapter for Fastly Compute@Edge

An adapter that allows the Compute@Edge JavaScript entry point program to start Remix.
This adapter package we have created is designed to be used with Fastly Compute@Edge alongside
[`@fastly/compute-js-static-publish`](https://github.com/fastly/compute-js-static-publish).

(`@fastly/compute-js-static-publish` is set up automatically for you if you set up your Remix
project using [`remix-template`](/packages/remix-template).)

## Usage

The simplest usage is the `createEventHandler` function, which simply needs to be passed the
`staticAssets` object exported from `./statics`. This file is generated automatically by
`@fastly/compute-js-static-publish`.

```js
/// <reference types="@fastly/js-compute" />  
import { createEventHandler } from '@fastly/remix-server-adapter';  
import { staticAssets } from './statics';  
  
addEventListener("fetch", createEventHandler({ staticAssets }));
```

If you need more granular control over the `ServerBuild` module to use with Remix, or whether to handle static assets,
you may use the lower-level `createEventHandler` and `handleAsset` functions:

```js
/// <reference types="@fastly/js-compute" />  
import { createRequestHandler, handleAsset } from '@fastly/remix-server-adapter';  
import { staticAssets } from './statics';

/** @type {import('@remix-run/server-runtime').ServerBuild} */  
const build = staticAssets.getAsset('/build/index.js').module;  
const requestHandler = createRequestHandler({build});  
 
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));  
async function handleRequest(event) {  
  let response = await handleAsset(event, staticAssets);  
 
  if (!response) {  
    response = requestHandler(event);  
  }  
 
  return response;  
}
```

## Issues

If you encounter any non-security-related bug or unexpected behavior, please [file an issue][bug]
using the bug report template.

[bug]: https://github.com/fastly/remix-compute-js/issues/new?labels=bug

### Security issues

Please see our [SECURITY.md](./SECURITY.md) for guidance on reporting security-related issues.

## License

[MIT](./LICENSE).
