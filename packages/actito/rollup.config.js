import { build } from '@actito/library-config/rollup-umbrella';
import pkg from './package.json' with { type: 'json' };

export default build(pkg);
