/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

const encoder = new TextEncoder();

async function calculateHash(value: string, secret: string) {
  const data = encoder.encode(value);
  const keyData = encoder.encode(secret);

  const privateKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

  const signature = await crypto.subtle.sign('HMAC', privateKey, data);

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
