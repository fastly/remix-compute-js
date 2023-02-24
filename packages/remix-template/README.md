# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

Prerequisites:

- Node >= 16.13
- [Fastly CLI](https://developer.fastly.com/learning/tools/cli) >= 7.0

You will be running two processes during development:

- The Remix development server in `watch` mode
- The [Fastly development server](https://developer.fastly.com/learning/compute/testing/#running-a-local-testing-server)

Both are started with one command:

```sh
npm run dev
```

Open up [http://127.0.0.1:7676](http://127.0.0.1:7676) and you should be ready to go!

Changes made to files in `app/` will cause the Remix application to rebuild and then trigger a live reload.
The live refresh occurs automatically `5000`ms after the rebuild.  If this delay is too short, you can
configure this using the `devServerBroadcastDelay` value in `remix.config.js` and then restart `npm run dev`.

If you want to check the production build, you can stop the dev server and run following commands:

```sh
npm run build
npm start
```

Then refresh the same URL in your browser (no live reload for production builds).

## Deployment

If you don't already have an account, then [create a Fastly Compute@Edge account here](https://www.fastly.com/signup/edge-compute).

Once that's done, you should be able to deploy your app:

```sh
npm run build
npm run deploy
```

## Issues

If you encounter any non-security-related bug or unexpected behavior, please [file an issue][bug]
using the bug report template.

[bug]: https://github.com/fastly/remix-compute-js/issues/new?labels=bug

### Security issues

Please see our [SECURITY.md](https://github.com/fastly/remix-compute-js/blob/main/SECURITY.md) for guidance on reporting security-related issues.

## License

[MIT](./LICENSE).
