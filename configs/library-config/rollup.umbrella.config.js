import { buildSources, buildStylesheet, buildTypeDefinitions } from './rollup.library.config.js';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import svg from 'rollup-plugin-svg-import';

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @typedef {import('rollup').ExternalOption} ExternalOption
 * @typedef {import('rollup').InputPluginOption} InputPluginOption
 */

const LATEST_VERSION_REGEX = /^\d+\.\d+\.\d+$/;
const INTERNAL_VERSION_REGEX = /^\d+\.\d+\.\d+-canary\.\d+$/;
const STYLED_COMPONENTS = ['in-app-messaging', 'push', 'push-ui'];

/**
 * Builds the configurations for the provided package components.
 *
 * @param {Object} pkg - The package object containing components to build.
 * @param {string} pkg.version - The semantic version of the package (e.g., '1.0.0').
 * @param {Array} pkg.components - An array of component names to process.
 * @return {RollupOptions[]} An array of configurations generated for the components.
 */
export function build(pkg) {
  const components = pkg.components;
  if (!components || !Array.isArray(components)) {
    throw new Error('Components must be an array of component names');
  }

  const configurations = [];

  for (const component of components) {
    configurations.push(...buildNpmPackage(pkg, component));

    if (pkg.version.match(LATEST_VERSION_REGEX)) {
      configurations.push(
        ...buildCdnDistribution({
          component,
          variant: 'latest',
          version: pkg.version,
        }),
      );
    }

    if (pkg.version.match(INTERNAL_VERSION_REGEX)) {
      configurations.push(
        ...buildCdnDistribution({
          component,
          variant: 'internal',
          version: pkg.version,
        }),
      );
    } else {
      configurations.push(
        ...buildCdnDistribution({
          component,
          variant: 'stable',
          version: pkg.version,
        }),
      );
    }
  }

  return configurations;
}

/**
 * Builds the NPM package distribution configurations for a given component.
 *
 * @param {Object} pkg
 * @param {string} component
 * @return {RollupOptions[]}
 */
function buildNpmPackage(pkg, component) {
  return [
    buildSources(
      {
        main: `${component}/dist/index.cjs`,
        module: `${component}/dist/index.mjs`,
        dependencies: pkg.dependencies,
        peerDependencies: pkg.peerDependencies,
      },
      {
        input: `${component}/index.ts`,
      },
    ),
    buildTypeDefinitions({
      input: `${component}/index.ts`,
      outDir: `${component}/dist`,
    }),
  ];
}

/**
 * Builds the CDN distribution configurations for a given component.
 *
 * @param {Object} options
 * @param {string} options.component
 * @param {string} options.variant
 * @param {string} options.version
 * @return {RollupOptions[]}
 */
function buildCdnDistribution({ component, variant, version }) {
  const componentName = component.replace('/', '-');

  /** @type ExternalOption */
  const external = [];

  /** @type InputPluginOption */
  const plugins = [esbuild(), svg(), nodeResolve(), terser()];

  // Handle the alias to the core package in the other modules.
  if (component !== 'core') {
    external.push(determineExternalCoreUrl({ variant, version }));

    plugins.push(
      alias({
        entries: [
          {
            find: '@actito/web-core',
            replacement: determineExternalCoreUrl({ variant, version }),
          },
        ],
      }),
    );
  }

  /** @type RollupOptions[] */
  const configurations = [
    {
      input: `${component}/index.ts`,
      output: {
        file: `dist/cdn/${variant}/actito-${componentName}.js`,
        format: 'esm',
        sourcemap: true,
      },
      external,
      plugins,
    },
  ];

  if (STYLED_COMPONENTS.includes(component)) {
    configurations.push(
      buildStylesheet({
        input: `${component}/${component}.css`,
        output: `dist/cdn/${variant}/actito-${componentName}.css`,
        minimize: true,
      }),
    );
  }

  return configurations;
}

function determineExternalCoreUrl({ variant, version }) {
  switch (variant) {
    case 'stable':
      return `https://cdn-mobile.actito.com/libs/web/v5/${version}/actito-core.js`;
    case 'latest':
      return 'https://cdn-mobile.actito.com/libs/web/v5/latest/actito-core.js';
    case 'internal':
      return `https://cdn-mobile.actito.com/libs/web/internal/${version}/actito-core.js`;
    default:
      throw new Error(`Unknown variant: ${variant}`);
  }
}
