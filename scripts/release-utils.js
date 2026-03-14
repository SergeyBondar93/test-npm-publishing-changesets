const { execFileSync, spawnSync } = require('child_process');
const PACKAGE_NAME = '@SergeyBondar93/test-independent-npm-package';

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function runStreaming(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status}`);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compareSemver(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return b[i] - a[i];
  }
  return 0;
}

function getLatestStableTag(cwd) {
  const regex = new RegExp(`^${escapeRegex(PACKAGE_NAME)}@(\\d+)\\.(\\d+)\\.(\\d+)$`);
  const tagsRaw = run('git', ['tag', '-l', `${PACKAGE_NAME}@*`], { cwd });
  const tags = tagsRaw ? tagsRaw.split('\n').map((v) => v.trim()).filter(Boolean) : [];

  const stableTags = tags
    .map((tag) => {
      const m = tag.match(regex);
      return m ? { tag, parts: [Number(m[1]), Number(m[2]), Number(m[3])] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => compareSemver(a.parts, b.parts));

  if (stableTags.length === 0) {
    throw new Error(`No stable tag found for ${PACKAGE_NAME}.`);
  }

  return stableTags[0].tag;
}

function extractVersionFromTag(tag) {
  return tag.replace(`${PACKAGE_NAME}@`, '');
}

function bumpVersion(baseVersion, releaseType) {
  const [major, minor, patch] = baseVersion.split('.').map(Number);

  if (releaseType === 'major') {
    return `${major + 1}.0.0`;
  }

  if (releaseType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }

  if (releaseType === 'patch') {
    return `${major}.${minor}.${patch + 1}`;
  }
}

function sanitizeBranchTag(branchName) {
  const raw = String(branchName || '').slice(0, 20);
  const sanitized = raw
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  return sanitized || 'feature';
}

function getLatestFeatureTag(distTag, cwd) {
  const pattern = `${PACKAGE_NAME}@*-${distTag}.*`;
  const regex = new RegExp(`^${escapeRegex(PACKAGE_NAME)}@(\\d+)\\.(\\d+)\\.(\\d+)-${escapeRegex(distTag)}\\.(\\d+)$`);
  const tagsRaw = run('git', ['tag', '-l', pattern], { cwd });
  const tags = tagsRaw ? tagsRaw.split('\n').map((v) => v.trim()).filter(Boolean) : [];

  const featureTags = tags
    .map((tag) => {
      const m = tag.match(regex);
      return m ? { tag, parts: [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      for (let i = 0; i < 4; i++) {
        if (a.parts[i] !== b.parts[i]) return b.parts[i] - a.parts[i];
      }
      return 0;
    });

  return featureTags.length > 0 ? featureTags[0].tag : null;
}

function createAndPushTag(tag, cwd) {
  runStreaming('git', ['tag', tag], { cwd });
  runStreaming('git', ['push', 'origin', tag], { cwd });
}

function publishPackage(version, distTag, cwd) {
  runStreaming('npm', ['version', version, '--no-git-tag-version'], { cwd });
  runStreaming('npm', ['publish', '--tag', distTag], { cwd });
}

function createGitHubRelease(tag, version, isPrerelease) {
  const args = ['release', 'create', tag, '--title', tag, '--notes', `Release ${version}`, '--verify-tag'];
  if (isPrerelease) {
    args.push('--prerelease');
  }
  runStreaming('gh', args);
}

module.exports = {
  PACKAGE_NAME,
  getLatestStableTag,
  extractVersionFromTag,
  bumpVersion,
  sanitizeBranchTag,
  getLatestFeatureTag,
  createAndPushTag,
  publishPackage,
  createGitHubRelease,
  runStreaming,
};
