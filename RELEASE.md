# Release process

1. Create a `release/x.y.z` branch from `develop`, e.g. `release/5.0.2` or `release/5.1.0-beta.1`.
2. Make sure the `CHANGELOG.md` entries for this release are under the `## Upcoming release` heading.
3. Open two pull requests from the release branch: one into `main` and one into `develop`.

The *Bump release version* workflow (`.github/workflows/pull-request-bump-sdk-version.yml`) pushes a `chore: bump version to x.y.z` commit to the release branch, so it shows up in both pull requests. That commit:

- updates the version of each library and `lerna.json`,
- updates the version in `packages/actito-core/src/internal/version.ts`,
- updates `yarn.lock`,
- renames `## Upcoming release` to `## x.y.z` in the `CHANGELOG.md`.

Pull that commit (`git pull`) before pushing more changes to the release branch.

4. Merge the pull request into `main`.

The *Release SDK* workflow (`.github/workflows/pull-request-release-sdk.yml`) then prepares the release, without publishing anything:

- checks that all the versions match the branch name,
- builds, lints, tests and checks the package types of the libraries,
- previews the NPM packages, their dist-tag and their contents,
- previews the files uploaded to (and deleted from) `libs/web/v5/x.y.z` and `libs/web/v5/latest` on the CDN,
- creates a draft GitHub release with the contents of the `CHANGELOG.md` for that version.

5. Review the release and approve it.

The workflow run waits for approval of the `release` environment. Open the run, check the *Prepare release* summary and the draft GitHub release, then select *Review deployments* and approve it. The *Publish release* job then, using the files built by *Prepare release*:

- releases the libraries to NPM through trusted publishing,
- uploads `packages/actito/dist/cdn/stable` to `libs/web/v5/x.y.z` on the CDN,
- uploads `packages/actito/dist/cdn/latest` to `libs/web/v5/latest` on the CDN and invalidates `/libs/web/v5/latest/*` in CloudFront,
- publishes the GitHub release, which creates the `x.y.z` tag.

If something is wrong, reject the deployment instead. Nothing is published. Push the fix to the release branch and open a new pull request into `main`; the existing draft GitHub release is updated when it's merged.

6. Once the *Release SDK* workflow succeeds, merge the pull request into `develop`.

## Prereleases

Versions with a suffix, such as `5.1.0-beta.1`, are published to NPM under the `next` dist-tag and only uploaded to `libs/web/v5/x.y.z-beta.n` on the CDN. The `latest` dist-tag and `libs/web/v5/latest` are never updated by a prerelease.

Canary versions (`x.y.z-canary.n`) can't be released through release branches.

## Testing the workflows

Outside the `actito/actito-sdk-web` repository, the *Release SDK* workflow runs as a dry run: nothing is published to NPM or uploaded to the CDN, while the version bump, the approval and the GitHub release work as usual. To test the whole flow, push the repository to a separate public repository (not a fork), create a `release` environment with yourself as a required reviewer, and follow the release process there.

## Bumping the version locally

The version can also be bumped locally, which creates the same changes without the GitHub workflow:

```shell
yarn lerna version x.y.z --force-publish --no-private --no-git-tag-version --no-push
```
