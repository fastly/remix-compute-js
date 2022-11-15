/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

/// <reference types='@fastly/js-compute' />

export type { GetLoadContextFunction, RequestHandler } from "./implementation";
export {
  createEventHandler,
  createRequestHandler,
  handleAsset,
} from "./implementation";
