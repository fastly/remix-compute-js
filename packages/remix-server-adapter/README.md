# Remix Adapter for Fastly Compute

An adapter that allows the Compute JavaScript entry point program to start Remix.  This adapter
package we have created is designed to be used with Fastly Compute, and currently uses
[`@fastly/compute-js-static-publish`](https://github.com/fastly/compute-js-static-publish)
behind the scenes to include resources into the Wasm package bundle.

(`@fastly/compute-js-static-publish` is set up automatically for you if you set up your Remix
project using [`remix-template`](/packages/remix-template).)

## Usage

The simplest usage is the `createEventHandler` function.
This function needs to be passed the following parameters:

- `build`, obtained by loading `/build/index.js`
- `server`, obtained by calling `getServer()`, exported from `../static-publisher/statics.js`

> HINT: `../static-publisher/statics.js` is generated automatically by `@fastly/compute-js-static-publish`.

```js
/// <reference types="@fastly/js-compute" />  
import { createEventHandler } from '@fastly/remix-server-adapter';
import { moduleAssets, getServer } from '../static-publisher/statics.js';

/** @type {import('@remix-run/server-runtime').ServerBuild} */
const build = moduleAssets.getAsset('/build/index.js').getStaticModule();

/** @type {import('@fastly/compute-js-static-publish').PublisherServer} */
const server = getServer();

addEventListener("fetch", createEventHandler({ build, server }));
```

If you need more granular control over the `ServerBuild` module to use with Remix, or whether/how to handle static assets,
you may use the lower-level `createRequestHandler` and `handleAsset` functions:

```js
/// <reference types="@fastly/js-compute" />  
import { createRequestHandler, handleAsset } from '@fastly/remix-server-adapter';  
import { moduleAssets, getServer } from '../static-publisher/statics.js';

/** @type {import('@remix-run/server-runtime').ServerBuild} */
const build = moduleAssets.getAsset('/build/index.js').getStaticModule();

/** @type {import('@fastly/compute-js-static-publish').PublisherServer} */
const server = getServer();

const requestHandler = createRequestHandler({build});  
 
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));  
async function handleRequest(event) {  
  let response = await handleAsset(event, build, server);  
 
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
