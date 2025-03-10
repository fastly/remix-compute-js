/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

/// <reference types='@fastly/js-compute' />

export {
  createCookie,
  createCookieSessionStorage,
  createMemorySessionStorage,
  createSessionStorage,
} from "./implementations.js";

export {
  createRequestHandler,
  createSession,
  defer,
  broadcastDevReady,
  logDevReady,
  isCookie,
  isSession,
  json,
  MaxPartSizeExceededError,
  redirect,
  redirectDocument,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";

// Remix server runtime packages should re-export these types
export type {
  ActionFunction,
  ActionFunctionArgs,
  AppLoadContext,
  Cookie,
  CookieOptions,
  CookieParseOptions,
  CookieSerializeOptions,
  CookieSignatureOptions,
  DataFunctionArgs,
  EntryContext,
  ErrorResponse,
  HandleDataRequestFunction,
  HandleDocumentRequestFunction,
  HeadersArgs,
  HeadersFunction,
  HtmlLinkDescriptor,
  JsonFunction,
  LinkDescriptor,
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
  MemoryUploadHandlerFilterArgs,
  MemoryUploadHandlerOptions,
  HandleErrorFunction,
  PageLinkDescriptor,
  RequestHandler,
  SerializeFrom,
  ServerBuild,
  ServerEntryModule,
  ServerRuntimeMetaArgs as MetaArgs,
  ServerRuntimeMetaDescriptor as MetaDescriptor,
  ServerRuntimeMetaFunction as MetaFunction,
  Session,
  SessionData,
  SessionIdStorageStrategy,
  SessionStorage,
  SignFunction,
  TypedDeferredData,
  TypedResponse,
  UnsignFunction,
  UploadHandler,
  UploadHandlerPart,
} from "@remix-run/server-runtime";
