# Release process

1. Create a `release/x.y.z` branch from `develop`, e.g. `release/5.0.2` or `release/5.1.0-beta.1`.
2. Make sure the `CHANGELOG.md` entries for this release are under a level-2 heading (starting with exactly `##`) without a version, such as `## Upcoming release`, above the previous versions.
3. Open two pull requests from the release branch: one into `main` and one into `develop`.

A `chore: bump version to x.y.z` commit will be automatically pushed to the release branch, making it appear in both pull requests. This commit:

- updates the version of each published package (the ones in `packages/`) and `lerna.json`,
- updates the version in `packages/actito-core/src/internal/version.ts`,
- updates `yarn.lock`,
- renames the first `##` heading without a version in the `CHANGELOG.md` to `## x.y.z`.

The workflows triggered by that commit wait for approval. Someone with write access can approve them to run the checks on the final code.

If you want to push more changes to the release branch, don't forget to pull that commit (`git pull`) first.

4. Merge the pull request into `main`.

This starts the ***Release SDK*** workflow, which builds and checks the libraries, previews what will be published and creates a draft GitHub release. Nothing is published yet.

5. Review the release and approve it.

The workflow run waits for approval of the `release` environment. A reviewer of that environment opens the run, checks the ***Prepare release*** summary and the draft GitHub release, and approves it with ***Review deployments***.

After the approval, the packages are published to NPM, the CDN files are uploaded to `libs/web/v5/x.y.z` and, for stable versions only, `libs/web/v5/latest`, and the GitHub release is published with its `x.y.z` tag.

If something is wrong, reject the deployment instead. Nothing is published. Push the fix to the release branch and open a new pull request into `main`; the existing draft GitHub release is updated when it's merged.

6. Once the ***Release SDK*** workflow succeeds, merge the pull request into `develop`.

> **Important:** Only release branches of this repository are released: pull requests from forks never trigger the version bump or the release.

## Prereleases

Release branches accept stable versions (`release/x.y.z`, e.g. `release/5.0.2`) and beta versions (`release/x.y.z-beta.n`, e.g. `release/5.1.0-beta.1`). Any other name, such as `release/v5.1.0`, `release/5.1.0-rc.1` or `release/5.1.0-beta`, fails the version validation.

Beta versions are published to NPM under the `beta` dist-tag (`npm install actito-web@beta`) and only uploaded to `libs/web/v5/x.y.z-beta.n` on the CDN. The `latest` dist-tag and `libs/web/v5/latest` are never updated by a beta, and its GitHub release is marked as a pre-release.