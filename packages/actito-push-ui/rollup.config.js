import { build, buildStylesheet } from '@actito/library-config/rollup';
import pkg from './package.json' with { type: 'json' };

export default [
  ...build(pkg),
  buildStylesheet({
    input: 'css/actito-push-ui.css',
    output: 'dist/actito-push-ui.css',
  }),
];
