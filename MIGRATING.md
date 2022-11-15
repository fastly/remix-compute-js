# Migrating an existing Remix application for Compute@Edge

If you already have a Remix application that you wish to move to Compute@Edge,
the easiest way to do this is to create an empty Remix project using [`remix-template`](/packages/remix-template).
This way, all the Compute@Edge-related dependencies will be installed for you, and the server adapter will be
created as part of the process as well.

> NOTE: If you wish to modify your project directly instead, see the [Modifying an existing Remix application for Compute@Edge](#modifying-an-existing-remix-app) section below.

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

* Depending on the dependencies used by your project, you may need to
[add polyfills to run in Compute@Edge](https://developer.fastly.com/learning/compute/javascript/#module-bundling).

# Modifying an existing Remix application for Compute@Edge <a name="modifying-an-existing-remix-app"></a>

If you'd rather modify your application in place to adapt it for Compute@Edge,
perform the following general steps in your project's directory.

* Install the following dependencies:

```shell
npm install @fastly/remix-server-runtime @fastly/remix-server-adapter
```

* Install the following development dependencies:

```shell
npm install --save-dev @fastly/compute-js-static-publish @fastly/js-compute js-core npm-run-all webpack webpack-cli 
```

* Uninstall the previous runtime, such as `@remix-run/node`.

```shell
npm uninstall @remix-run/node
```

* Uninstall the previous adapter if any, such as `@remix-run/express`.

```shell
npm uninstall @remix-run/express
```

* In `remix.config.js`, replace the value of the `serverBuildTarget` field with `"fastly-compute-js"`.

* In `remix.config.js`, set the value of the `devServerBroadcastDelay` field to `10000`.

* Modify `.gitignore` and add the following lines:

```gitignore
# Fastly Compute@Edge
/bin
/pkg
# @fastly/compute-js-static-publish
/src/statics.js
```

* Create a `src/index.js` file with the following content:

```js
/// <reference types="@fastly/js-compute" />
import { createEventHandler } from '@fastly/remix-server-adapter';
import { staticAssets } from './statics';

addEventListener("fetch", createEventHandler({ staticAssets }));
```

* Create a `fastly.toml` file with the following content:

```toml
# This file describes a Fastly Compute@Edge package. To learn more visit:
# https://developer.fastly.com/reference/fastly-toml/
  
authors = []
description = ""
language = "javascript"
manifest_version = 2
name = "remix-compute-js-app"
service_id = ""
  
[scripts]
build = "npx @fastly/compute-js-static-publish --build-static --suppress-framework-warnings && npm exec webpack && npm exec js-compute-runtime ./bin/index.js ./bin/main.wasm" 
```

* Create a `static-publish.rc.js` file with the following content:

```js
/*
* Copyright Fastly, Inc.
* Licensed under the MIT license. See LICENSE file for details.
*/

const path = require("path");
const publicDir = path.resolve(process.cwd());

module.exports = {
  publicDir: "./",
  excludeDirs: ['./node_modules',],
  includeDirs: ['./build', './public'],
  staticDirs: ['./public/build'],
  moduleTest: function (path) {
    if (path.endsWith('/remix.config.js') || path.endsWith('/remix.config.mjs')) {
      return true;
    }
    return path.indexOf('/build/') === 0 && !path.endsWith('.map');
  },
  excludeTest: function (path) {
    if (path.startsWith(publicDir + '/remix.config.js') || path.endsWith(publicDir + '/remix.config.mjs')) {
      return false;
    }
    if (path.startsWith(publicDir + '/build/') || path.startsWith(publicDir + '/public/')) {
      return false;
    }
    return true;
  },
  spa: false,
  autoIndex: [],
  autoExt: [],
};
```

* Create a `webpack.config.js` file with the following content:

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  optimization: {
    minimize: false,
  },
  target: "webworker",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
    libraryTarget: "this",
  },
  module: {
    // Asset modules are modules that allow the use asset files (fonts, icons, etc) 
    // without additional configuration or dependencies.
    rules: [
      // asset/source exports the source code of the asset. 
      // Usage: e.g., import notFoundPage from "./page_404.html"
      {
        test: /\.(txt|html)/,
        type: "asset/source",
      },
      {
        // asset/source exports the source code of the asset.
        resourceQuery: /staticText/,
        type: "asset/source",
      },
      {
        // asset/inline exports the raw bytes of the asset.
        // We base64 encode them here
        resourceQuery: /staticBinary/,
        type: "asset/inline",
        generator: {
          /**
           * @param {Buffer} content
           * @returns {string}
           */
          dataUrl: content => {
            return content.toString('base64');
          },
        }
      },
    ],
  },
  plugins: [
    // Polyfills go here.
    // Used for, e.g., any cross-platform WHATWG, 
    // or core nodejs modules needed for your application.
  ],
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "events": require.resolve("events/"),
      "stream": require.resolve("stream-browserify"),
    }
  }
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
    "build": "remix build",
    "dev:remix": "remix watch",
    "dev:fastly": "fastly compute serve --watch",
    "dev": "remix build && run-p \"dev:*\"",
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

* Depending on your application, further changes may be necessary. Refer to `remix-template` as an example.
