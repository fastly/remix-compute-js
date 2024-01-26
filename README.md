# Remix on Fastly Compute

Deploy and serve your [Remix](https://remix.run/) website from Fastly's blazing-fast [Compute](https://developer.fastly.com/learning/compute/).

> NEW! This is for version 2 of Remix. If you need to support version 1, then use version 3 of this library.

## Remix

Remix is a popular JavaScript-based full stack web framework that is designed to allow the developer to focus on the
user interface and work back through web standards to deliver a fast, slick, and resilient user experience.

## Usage

The easiest way to get up and running is to use [Remix's CLI](https://remix.run/docs/en/v1/other-api/dev) to initialize your
project, specifying `remix-template` as the template. See [using the template](#using-the-template) below.

If you already have a Remix application that you'd like to move to Fastly Compute, see [MIGRATING.md](MIGRATING.md).

Once you have initialized your project, start the application:

```shell
npm run dev
```

You can browse your shiny new application at [http://127.0.0.1:7676](http://127.0.0.1:7676)!

To deploy your project to Fastly, use the following commands:

```shell
npm run build
npm run deploy
```

For more details, see the [README file of remix-template](/packages/remix-template/README.md). 

## Structure

This monorepo contains three projects:

* [`@fastly/remix-server-runtime`](/packages/remix-server-runtime)

  A runtime that implements the interfaces defined in `@remix-run/server-runtime`. Allows
the Remix framework to run on Fastly Compute.

* [`@fastly/remix-server-adapter`](/packages/remix-server-adapter)

  An adapter that allows the Compute JavaScript entry point program to start Remix.

* [`remix-template`](/packages/remix-template)

  A template to be used with [`remix create`](https://remix.run/docs/en/v1/other-api/dev#remix-create)
to initialize a Remix application. The template is configured with the above libraries so that
it is able to run on Fastly Compute.

## Using the template

Initialize your new Remix application by running the following:

```shell
npm create remix@latest ./new-app-js -- --template https://github.com/fastly/remix-compute-js/tree/main/packages/remix-template
```

## Webpack

Out of the box, this library does not use Webpack or polyfills to work under Fastly Compute.
There are cases where you may still want to use Webpack, such as if you want to replace global modules or use polyfills.
For details, see "Module bundling" in the template's [README](./packages/remix-template/README.md).

## Issues

If you encounter any non-security-related bug or unexpected behavior, please [file an issue][bug]
using the bug report template.

[bug]: https://github.com/fastly/remix-compute-js/issues/new?labels=bug

### Security issues

Please see our [SECURITY.md](./SECURITY.md) for guidance on reporting security-related issues.

## License

[MIT](./LICENSE).
