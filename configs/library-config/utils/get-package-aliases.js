import fs from 'fs';
import path from 'path';

export function getPackageAliases() {
  const json = fs.readFileSync('./tsconfig.json', 'utf8');
  const tsconfig = JSON.parse(json);

  const paths = tsconfig.compilerOptions.paths ?? {};
  const baseUrl = tsconfig.compilerOptions.baseUrl ?? '.';

  return Object.entries(paths).flatMap(([key, values]) => {
    const find = key.replace('/*', '');
    return values.map((p) => {
      const replacement = path.resolve(baseUrl, p.replace('/*', ''));
      return { find, replacement };
    });
  });
}
