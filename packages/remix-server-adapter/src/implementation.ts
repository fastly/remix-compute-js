/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

import type { PublisherServer } from "@fastly/compute-js-static-publish";

import type { AppLoadContext, ServerBuild } from "@fastly/remix-server-runtime";
import { createRequestHandler as createRemixRequestHandler } from "@fastly/remix-server-runtime";

/**
 * A function that returns the value to use as `context` in route `loader` and
 * `action` functions.
 *
 * You can think of this as an escape hatch that allows you to pass
 * environment/platform-specific values through to your loader/action.
 */
export type GetLoadContextFunction = (event: FetchEvent) => Promise<AppLoadContext> | AppLoadContext;

export type RequestHandler = ReturnType<typeof createRequestHandler>;

/**
 * Generates a Response that would serve a static asset corresponding to the URL requested
 * by the passed-in FetchEvent.
 * @param event { FetchEvent }
 * @param build { ServerBuild }
 * @param server { PublisherServer }
 */
export async function handleAsset(
  event: FetchEvent,
  build: ServerBuild,
  server: PublisherServer,
): Promise<Response | null> {

  const request = event.request;
  const requestPathname = new URL(request.url).pathname;

  const asset = server.getMatchingAsset(requestPathname);
  if (asset == null) {
    return null;
  }

  let cache: 'extended' | 'never' | undefined = undefined;

  if (process.env.NODE_ENV === "development") {
    cache = 'never';
  } else {
    let assetpath = build.assets.url.split("/").slice(0, -1).join("/");
    let requestpath = requestPathname.split("/").slice(0, -1).join("/");

    if (requestpath.startsWith(assetpath)) {
      // Assets are hashed by Remix so are safe to cache in the browser
      cache = 'extended';
    } else {
      // Assets are not necessarily hashed in the request URL, so we cannot cache in the browser
    }
  }

  return server.serveAsset(event.request, asset, { cache });
}

/**
 * Returns a request handler for the Fastly Compute runtime that serves the
 * Remix SSR response.
 */
export function createRequestHandler({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
}) {
  let handleRequest = createRemixRequestHandler(build, mode);

  return async (event: FetchEvent) => {
    let loadContext = await getLoadContext?.(event);

    // HACK: Until js-compute supports AbortSignal on Request
    // we add a fake AbortSignal that doesn't actually abort
    (Request.prototype as any).signal ??= {
      aborted: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    return handleRequest(event.request, loadContext);
  };
}

/**
 * Creates a simplified event handler that can be used on Fastly Compute.
 * @param build { ServerBuild }
 * @param getLoadContext { GetLoadContextFunction }
 * @param serve { PublisherServer }
 * @param mode { string }
 */
export function createEventHandler({
  build,
  getLoadContext,
  server,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  server: PublisherServer;
  mode?: string;
}) {
  let handleRequest = createRequestHandler({
    build,
    getLoadContext,
    mode,
  });

  let handleEvent = async (event: FetchEvent) => {
    let response = await handleAsset(event, build, server);

    if (!response) {
      response = await handleRequest(event);
    }

    return response;
  };

  return (event: FetchEvent) => {
    try {
      event.respondWith(handleEvent(event));
    } catch (e: any) {
      if (process.env.NODE_ENV === "development") {
        event.respondWith(
          new Response(e.message || e.toString(), {
            status: 500,
          })
        );
        return;
      }

      event.respondWith(new Response("Internal Error", { status: 500 }));
    }
  };
}
