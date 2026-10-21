import { resolve } from 'node:path';
import { getPackageAliases } from './utils/get-package-aliases.js';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg-import';

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 */

/**
 * Builds the source configuration for a module.
 *
 * @param {Object} pkg - The package's metadata, typically containing fields like `main` and `module`, and dependency information.
 * @param {Object} [options] - The options for customizing the build configuration.
 * @param {string} [options.input] - The input file for the build. Defaults to 'src/index.ts' if not provided.
 * @return {Object} The configuration object containing `input`, `output`, `plugins`, and `external` settings.
 */
export function buildSources(pkg, options) {
  return {
    input: options?.input ?? 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
        entries: getPackageAliases(),
      }),
      esbuild(),
      svg(),
      nodeResolve({ extensions: ['.ts', '.mjs', '.js', '.json', '.node'] }),
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  };
}

/**
 * Builds type definition configurations for a module.
 *
 * @param {Object} [options] - Options object to configure type definition generation.
 * @param {string} [options.input] - The path to the input file for generating type definitions. Defaults to 'src/index.ts'.
 * @param {string} [options.outDir] - The output directory for the generated type definition files.
 * @return {RollupOptions} Configuration object for type definition generation.
 */
export function buildTypeDefinitions(options) {
  return {
    input: options?.input ?? 'src/index.ts',
    output: [
      {
        file: options?.outDir ? resolve(options.outDir, 'index.d.cts') : 'dist/index.d.cts',
        format: 'cjs',
      },
      {
        file: options?.outDir ? resolve(options.outDir, 'index.d.mts') : 'dist/index.d.mts',
        format: 'esm',
      },
    ],
    plugins: [
      alias({
        entries: getPackageAliases(),
      }),
      dts(),
    ],
  };
}

/**
 * Builds a stylesheet configuration object with specified options.
 *
 * @param {Object} options - The configuration options for building the stylesheet.
 * @param {string} options.input - The input file path for the stylesheet.
 * @param {string} options.output - The output file path for the generated stylesheet.
 * @param {boolean} [options.minimize] - A flag indicating whether to minimize the output CSS.
 * @return {RollupOptions} The configuration object for the stylesheet build process.
 */
export function buildStylesheet(options) {
  return {
    input: options.input,
    output: [
      {
        file: options.output,
      },
    ],
    plugins: [
      postcss({
        extract: true,
        minimize: options.minimize,
      }),
    ],
  };
}

/**
 * Builds the sources and type definitions for a given package.
 *
 * @param {Object} pkg - The package configuration object containing metadata about the project, including dependencies and entry points.
 * @return {Array<RollupOptions>} An array containing the built sources and type definitions.
 */
export function build(pkg) {
  return [buildSources(pkg), buildTypeDefinitions()];
}
