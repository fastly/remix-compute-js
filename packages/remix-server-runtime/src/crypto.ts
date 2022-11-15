/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

import * as crypto from 'crypto';

const encoder = new TextEncoder();

async function calculateHash(value: string, secret: string) {

  const key = encoder.encode(secret);
  const signature = crypto.createHmac('sha256', key)
    .update(value)
    .digest();

  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
    /=+$/,
    ""
  );

}

export async function sign(value: string, secret: string) {

  let hash = await calculateHash(value, secret);
  return value + '.' + hash;

}

export async function unsign(signed: string, secret: string) {

  let index = signed.lastIndexOf(".");
  let value = signed.slice(0, index);

  let hash = signed.slice(index + 1);
  let expectedHash = await calculateHash(value, secret);
  const valid = hash === expectedHash;

  return valid ? value : false;

}
