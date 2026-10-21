import tsconfig from './tsconfig.json' with { type: 'json' };
import { configureJest } from '@actito/library-config/jest';

const { compilerOptions } = tsconfig;

export default configureJest(compilerOptions.paths);
