// Runs as the root "version" lifecycle of `lerna version`, after lerna.json is updated
// and before the version commit is created.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const SDK_VERSION_FILE = 'packages/actito-core/src/internal/version.ts';
const CHANGELOG_FILE = 'CHANGELOG.md';
const VERSION_HEADING_REGEX = /^## \d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?\s*$/;

const { version } = JSON.parse(readFileSync('lerna.json', 'utf8'));

writeFileSync(SDK_VERSION_FILE, `export const SDK_VERSION = '${version}';\n`);

// Renames the first "## " heading without a version, e.g. "## Upcoming release", to the new version.
const lines = readFileSync(CHANGELOG_FILE, 'utf8').split('\n');
const unreleasedHeadingIndex = lines.findIndex(
  (line) => line.startsWith('## ') && !VERSION_HEADING_REGEX.test(line),
);

if (lines.some((line) => line.trim() === `## ${version}`)) {
  console.info(`${CHANGELOG_FILE} already has a "## ${version}" heading.`);
} else if (unreleasedHeadingIndex === -1) {
  console.warn(`No "## " heading without a version found in ${CHANGELOG_FILE}.`);
} else {
  lines[unreleasedHeadingIndex] = `## ${version}`;
  writeFileSync(CHANGELOG_FILE, lines.join('\n'));
}

execFileSync('git', ['add', SDK_VERSION_FILE, CHANGELOG_FILE]);
