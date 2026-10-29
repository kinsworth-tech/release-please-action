import {
  BuildNotesOptions,
  ChangelogNotes,
  ChangelogNotesFactoryOptions,
  ConventionalCommit,
} from 'release-please';
import {DefaultChangelogNotes} from 'release-please/build/src/changelog-notes/default';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function usePullRequestLinks(
  notes: string,
  commits: ConventionalCommit[],
  options: BuildNotesOptions,
): string {
  const pullRequestNumbers = new Set(
    commits
      .map(commit => commit.pullRequest?.number)
      .filter((number): number is number => number !== undefined)
  );
  const host = options.host ?? 'https://github.com';
  const linkPattern = new RegExp(
    `(https://github\\.com/${escapeRegex(options.owner)}/${escapeRegex(options.repository)}/)issues/(\\d+)`,
    'g',
  );

  if (host !== 'https://github.com' || pullRequestNumbers.size === 0) {
    return notes;
  }

  return notes.replace(linkPattern, (url, prefix, number) =>
    pullRequestNumbers.has(Number(number)) ? `${prefix}pull/${number}` : url,
  );
}

export class DefaultPullRequestChangelogNotes implements ChangelogNotes {
  private readonly defaultNotes: DefaultChangelogNotes;

  constructor(options: ChangelogNotesFactoryOptions) {
    this.defaultNotes = new DefaultChangelogNotes(options);
  }

  async buildNotes(
    commits: ConventionalCommit[],
    options: BuildNotesOptions,
  ): Promise<string> {
    const notes = await this.defaultNotes.buildNotes(commits, options);

    return usePullRequestLinks(notes, commits, options);
  }
}
