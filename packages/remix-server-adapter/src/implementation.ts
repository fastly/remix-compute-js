/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

import type { StaticAssets } from "@fastly/compute-js-static-publish";

import type { AppLoadContext, ServerBuild } from "@fastly/remix-server-runtime";
import { createRequestHandler as createRemixRequestHandler } from "@fastly/remix-server-runtime";

/**
 * A function that returns the value to use as `context` in route `loader` and
 * `action` functions.
 *
 * You can think of this as an escape hatch that allows you to pass
 * environment/platform-specific values through to your loader/action.
 */
export type GetLoadContextFunction = (event: FetchEvent) => AppLoadContext;

export type RequestHandler = ReturnType<typeof createRequestHandler>;

/**
 * Generates a Response that would serve a static asset corresponding to the URL requested
 * by the passed-in FetchEvent.
 * @param event { FetchEvent }
 * @param staticAssets { StaticAssets }
 */
export async function handleAsset(event: FetchEvent, staticAssets: StaticAssets): Promise<Response | null> {
  return staticAssets.serveAssetForEvent(event, '/public');
}

/**
 * Returns a request handler for the Fastly Compute@Edge runtime that serves the
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

  return (event: FetchEvent) => {
    let loadContext = getLoadContext?.(event);

    // HACK: Until js-compute supports AbortSignal on Request
    // we add a fake AbortSignal that doesn't actually abort
    const request: any = event.request;
    if (request.signal == null) {
      request.signal = {
        aborted: false,
        addEventHandler: () => {},
        removeEventHandler: () => {},
      };
    }

    return handleRequest(request, loadContext);
  };
}

/**
 * Creates a simplified event handler that can be used on Fastly Compute@Edge.
 * @param staticAssets { StaticAssets }
 * @param getLoadContext { GetLoadContextFunction }
 * @param mode
 */
export function createEventHandler({
  staticAssets,
  getLoadContext,
  mode,
}: {
  staticAssets: StaticAssets;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
}) {
  const build = staticAssets.getAsset('/build/index.js').module as ServerBuild;

  let handleRequest = createRequestHandler({
    build,
    getLoadContext,
    mode,
  });

  let handleEvent = async (event: FetchEvent) => {
    let response = await handleAsset(event, staticAssets);

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
