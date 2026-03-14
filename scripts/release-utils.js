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

function getLatestStableTag(cwd) {
  const regex = new RegExp(`^${escapeRegex(PACKAGE_NAME)}@(\\d+)\\.(\\d+)\\.(\\d+)$`);
  const tagsRaw = run('git', ['tag', '-l', `${PACKAGE_NAME}@*`, '--sort=-v:refname'], { cwd });
  const tags = tagsRaw ? tagsRaw.split('\n').map((v) => v.trim()).filter(Boolean) : [];
  const stableTag = tags.find((tag) => regex.test(tag));

  if (!stableTag) {
    throw new Error(`No stable tag found for ${PACKAGE_NAME}.`);
  }

  return stableTag;
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

function getLatestFeatureTag(pkgName, distTag, cwd) {
  const pattern = `${pkgName}@*-${distTag}`;
  const regex = new RegExp(`^${escapeRegex(pkgName)}@(\\d+)\\.(\\d+)\\.(\\d+)-${escapeRegex(distTag)}$`);
  const tagsRaw = run('git', ['tag', '-l', pattern, '--sort=-v:refname'], { cwd });
  const tags = tagsRaw ? tagsRaw.split('\n').map((v) => v.trim()).filter(Boolean) : [];
  return tags.find((tag) => regex.test(tag)) || null;
}

function createAndPushTag(tag, cwd) {
  runStreaming('git', ['tag', tag], { cwd });
  runStreaming('git', ['push', 'origin', tag], { cwd });
}

module.exports = {
  PACKAGE_NAME,
  getLatestStableTag,
  extractVersionFromTag,
  bumpVersion,
  sanitizeBranchTag,
  getLatestFeatureTag,
  createAndPushTag,
  runStreaming,
};
