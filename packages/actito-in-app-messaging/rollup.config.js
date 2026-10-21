import { build, buildStylesheet } from '@actito/library-config/rollup';
import pkg from './package.json' with { type: 'json' };

export default [
  ...build(pkg),
  buildStylesheet({
    input: 'css/actito-in-app-messaging.css',
    output: 'dist/actito-in-app-messaging.css',
  }),
];
