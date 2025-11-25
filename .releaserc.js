module.exports = {
  branches: ['main'],
  tagFormat: '${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './npm-package',
      },
    ],
    // Removed @semantic-release/git to avoid direct pushes to protected branches.
    // When running in protected branches that require PRs, pushing from CI will fail.
    // If you still want auto-commits for CHANGELOG/package.json, consider creating
    // a PR from the prepare step instead of pushing to the protected branch.
    '@semantic-release/github',
  ],
};
