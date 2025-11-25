module.exports = {
  branches: ['main'],
  // When running releases inside a monorepo we want tag names to include the
  // package name so tags are unambiguous (e.g. @scope/pkg@1.2.3). The
  // semantic-release-monorepo plugin exposes the package name to templates so
  // we can use ${name}@${version} safely.
  tagFormat: '${name}@${version}',
  plugins: [
    // Unsquash plugin extracts original PR commits when GitHub squash-merges
    // so semantic-release can analyze conventional-commit messages from those
    // commits instead of only the squash commit message.
    
    // Ensure monorepo-aware behaviour is applied early so ${name} resolves
    // to the current package being released.
    'semantic-release-monorepo',
    'semantic-release-unsquash',
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
