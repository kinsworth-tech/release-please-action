import * as assert from 'assert';
import { describe, it } from 'mocha';
import { ConventionalCommit } from 'release-please';
import { usePullRequestLinks } from '../src/default-changelog-notes';

const options = {
  currentTag: 'v1.1.0',
  owner: 'kinsworth-tech',
  previousTag: 'v1.0.0',
  repository: 'foundryos-kinsworth-app',
  targetBranch: 'main',
  version: '1.1.0',
};

const commits = [
  {pullRequest: {number: 123}},
] as ConventionalCommit[];

describe('DefaultPullRequestChangelogNotes', () => {
  it('uses pull request URLs for linked pull requests', () => {
    const notes =
      '[Feature](https://github.com/kinsworth-tech/foundryos-kinsworth-app/issues/123)';

    assert.strictEqual(
      usePullRequestLinks(notes, commits, options),
      '[Feature](https://github.com/kinsworth-tech/foundryos-kinsworth-app/pull/123)',
    );
  });

  it('keeps issue URLs that are not linked pull requests', () => {
    const notes =
      '[Issue](https://github.com/kinsworth-tech/foundryos-kinsworth-app/issues/456)';

    assert.strictEqual(usePullRequestLinks(notes, commits, options), notes);
  });
});
