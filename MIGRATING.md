# Migrating an existing Remix application for Compute

If you already have a Remix application that you wish to move to Compute,
the easiest way to do this is to create an empty Remix project using [`remix-template`](/packages/remix-template).
This way, all the Compute-related dependencies will be installed for you, and the server adapter will be
created as part of the process as well.

> NOTE: If you wish to modify your project directly instead, see the [Modifying an existing Remix application for Fastly Compute](#modifying-an-existing-remix-app) section below.

The general steps are as follows:

1. Create an empty Remix project with `remix-template` by following the [steps in the README](/README.md#using-the-template).
2. Install into your new project any additional dependency packages referenced by your original project.
3. Move your existing project’s files into your new project.

In Remix, your application’s files are found in `app/` and `public/`. For most of the files in these directories, you can
usually simply copy them into your new project, keeping the following points in mind.

* Some of the source files will reference Remix runtime packages such as `@remix-run/node`, `@remix-run/cloudflare`, or `@remix-run/deno`.
Modify these references to @fastly/remix-server-runtime.

	For example, you may have the following:
    ```typescript
    import { json } from "@remix-run/node";
    ```

	You’ll want to change this to:
    ```typescript
    import { json } from "@fastly/remix-server-runtime";
    ```


* For `entry.client.tsx`, `entry.server.tsx`, and `root.tsx` in the `app/` directory, you’ll generally want to start with
the ones found in the new project.  Examine these files in your source project.  Look for any changes that you had made
to them in your source project, and then make the equivalent changes in the new project as necessary.

* Skip `/public/build/`.  This is a directory that is generated during the build step.

* Depending on the dependencies used by your project, you may need to use module bundling and add polyfills to run in Compute.
For details, see "Module bundling" in the template's [README](./packages/remix-template/README.md).

# Modifying an existing Remix application for Fastly Compute <a name="modifying-an-existing-remix-app"></a>

If you'd rather modify your application in place to adapt it for Fastly Compute,
perform the following general steps in your project's directory.

* Install the following dependencies:

```shell
npm install @fastly/remix-server-runtime @fastly/remix-server-adapter
```

* Install the following development dependencies:

```shell
npm install --save-dev @fastly/compute-js-static-publish@6 @fastly/js-compute npm-run-all 
```

* Uninstall the previous runtime, such as `@remix-run/node`.

```shell
npm uninstall @remix-run/node
```

* Uninstall the previous adapter if any, such as `@remix-run/express`.

```shell
npm uninstall @remix-run/express
```

* In `remix.config.js`, remove the `serverBuildTarget` field if it's set. Also, make sure the following values are set:
```
  serverConditions: ["worker"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: false,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
```

* In `remix.config.js`, set the value of the `devServerBroadcastDelay` field to `10000`.

* Modify `.gitignore` and add the following lines:

```gitignore
# Fastly Compute
/bin
/pkg
# @fastly/compute-js-static-publish
/src/statics.js
/src/statics.d.ts
/src/statics-metadata.js
/src/statics-metadata.d.ts
/src/static-content
```

* Create a `src/index.js` file with the following content:

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

* Create a `fastly.toml` file with the following content:

```toml
# This file describes a Fastly Compute package. To learn more visit:
# https://developer.fastly.com/reference/fastly-toml/
  
authors = []
description = ""
language = "javascript"
manifest_version = 2
name = "remix-compute-js-app"
service_id = ""
  
[scripts]
build = "npm run build" 
```

* Create a `static-publish.rc.js` file with the following content:

```js
/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

/** @type {import('@fastly/compute-js-static-publish').StaticPublisherConfig} */
export default {
  rootDir: './',
  staticContentRootDir: './static-publisher',
  excludeDirs: [ './node_modules', ],
  moduleAssetInclusionTest: function(path) {
    if (path.startsWith('/build/') && !path.endsWith('.map')) { return 'static-import'; }
    return false;
  },
  contentAssetInclusionTest: function(path) {
    if (path.startsWith('/public/')) { return true; }
    return false;
  },
  server: {
    publicDirPrefix: '/public',
  },
};
```

* Modify `remix.env.d.ts` and each source file in `/app`, replacing any references to the previous runtime with
`@fastly/remix-server-runtime`. This includes `import` statements, `/// <reference />` directives, and if your application
is in TypeSCript, `import type` statements.

Examples:

```js
// Change this:
import { json } from "@remix-run/node";
// to this:
import { json } from "@fastly/remix-server-runtime";
```

```js
// Change this:
/// <reference types="@remix-run/node" />
// to this:
/// <reference types="@fastly/remix-server-runtime" />
```

```typescript
// Change this:
import type { EntryContext } from "@remix-run/node";
// to this:
import type { EntryContext } from "@fastly/remix-server-runtime";
```

* Add the following `scripts` to `package.json`

```json
{
  "scripts": {
    "build": "npm run build:remix && npm run build:fastly",
    "build:remix": "remix build",
    "prebuild:fastly": "compute-js-static-publish --build-static --suppress-framework-warnings",
    "build:fastly": "js-compute-runtime ./src/index.js ./bin/main.wasm",
    "deploy": "fastly compute publish",
    "dev:remix": "remix watch",
    "dev:fastly": "fastly compute serve --watch",
    "dev": "run-p \"dev:*\"",
    "start": "fastly compute serve"
  }
}
```

* If your current `entry.server.js/ts` uses `renderToPipeableStream` or `renderToReadableStream` to generate their
Server-Side-Rendering markup, then you'll have to modify it to use `renderToString`. The following is an example:

```typescript jsx
import type { EntryContext } from "@fastly/remix-server-runtime";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
```

* Depending on the dependencies used by your project, you may need to use module bundling and add polyfills to run in Compute.
For details, see "Module bundling" in the template's [README](./packages/remix-template/README.md).

* Depending on your application, further changes may be necessary. Refer to `remix-template` as an example.
