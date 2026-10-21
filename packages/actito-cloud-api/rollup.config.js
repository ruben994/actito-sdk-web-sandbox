import { build } from '@actito/library-config/rollup';
import pkg from './package.json' with { type: 'json' };

export default build(pkg);
