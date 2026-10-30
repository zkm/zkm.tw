# Deploying

Releases deploy from GitHub Actions when a `vX.Y.Z` tag is pushed on `master`. Pushing to `master`
on its own deploys nothing.

## Releasing

Bump `version` in `package.json` in a pull request, merge it, then tag the merge:

```
git switch master && git pull
git tag v4.1.0 && git push origin v4.1.0
```

`.github/workflows/deploy.yml` then:

1. runs the full CI workflow (`ci.yml`: `yarn verify`, the worker typecheck, `yarn build`) on the tag;
2. checks that the tag is `vX.Y.Z`, matches `package.json` and is on `master`, and builds it;
3. saves `dist/` as a tarball, with its SHA-256, on a GitHub Release marked pre-release;
4. waits for approval on the `production` environment (Actions → the run → **Review deployments**);
5. force-pushes the `release` branch to the tag and asks App Platform for a deployment
   (`doctl apps create-deployment --wait`);
6. checks that the deployment went `ACTIVE` and built the tag's commit, then marks the release
   as the latest.

App Platform can only build the tip of a branch, so `release` is how a tag gets deployed.
DigitalOcean builds the source itself (`yarn build`, serving `dist/`); the tarball on the
Release is a record of what that tag builds to, not the files it serves. A failed build leaves
the previous deployment live, and the workflow fails.

Only the workflow should move `release`. Don't push to it or open pull requests against it.

## Rolling back

Actions → **Deploy** → **Run workflow**, and under *Use workflow from* pick the tag to go back to.
That skips the tests and build, moves `release` back to that tag and redeploys it, after approval
as usual.

App Platform's own **Rollback** (the app's Activity tab) also works and is quicker, but it leaves
`release` pointing at the newer tag until the next deploy.

## How the access is limited

The repository is public, so:

- **The DigitalOcean token is scoped to apps** (read and update) and can't touch droplets,
  DNS or billing.
- **It lives on the `production` environment**, which only `v*` tags may use and which needs
  your approval. Pull requests, forks and branch pushes can't read it.
- **The workflow's `GITHUB_TOKEN` can write** only in the build and deploy jobs, to create the
  release and move `release`.

## One-time setup

Commands are fish. The app is `jellyfish-app`, id `3a8de4fa-4b95-40c5-ae94-db82a40331cd`.

**1. A token just for deploys.** DigitalOcean → API → Generate New Token, custom scopes,
`app` read and update. Keep it on the clipboard for step 3.

**2. The `production` environment**: you approve each deploy, and only `v*` tags may use it.
(GitHub matches environment names without regard to case, so this updates the existing
`Production`.) `<your user id>` is `gh api user -q .id`.

```
echo '{"reviewers":[{"type":"User","id":<your user id>}],"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}' | gh api -X PUT repos/zkm/zkm.tw/environments/Production --input -
gh api -X POST repos/zkm/zkm.tw/environments/Production/deployment-branch-policies -f name='v*' -f type=tag
```

**3. The secret and the app id**:

```
gh secret set DIGITALOCEAN_ACCESS_TOKEN --env Production    # paste the token at the prompt
gh variable set DO_APP_ID --env Production --body 3a8de4fa-4b95-40c5-ae94-db82a40331cd
```

**4. Point the app at `release`.** Create the branch first, on the commit that's already live.
Changing the branch in the spec redeploys whatever DigitalOcean last saw on that branch, so it
must exist and be current before the switch.

```
git push origin origin/master:refs/heads/release
doctl apps spec get 3a8de4fa-4b95-40c5-ae94-db82a40331cd > /tmp/zkm-tw-spec.yaml
# in the file: static_sites[0].github.branch: release, deploy_on_push: false
doctl apps update 3a8de4fa-4b95-40c5-ae94-db82a40331cd --spec /tmp/zkm-tw-spec.yaml
```

`deploy_on_push: false` matters: with it on, the workflow's push to `release` would start a
second, competing deployment.

**5. A first release.** Tag the current `master` with the `package.json` version and approve the run.
