/// <reference types="@fastly/js-compute" />
import { createEventHandler } from '@fastly/remix-server-adapter';
import { staticAssets } from './statics';

addEventListener("fetch", createEventHandler({ staticAssets }));
