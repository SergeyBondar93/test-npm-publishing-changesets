const {
  PACKAGE_NAME,
  getLatestStableTag,
  extractVersionFromTag,
  bumpVersion,
  sanitizeBranchTag,
  getLatestFeatureTag,
  createAndPushTag,
  publishPackage,
  createGitHubRelease,
} = require('./release-utils');

function main() {
  const branchName = process.argv[2];
  const cwd = process.cwd();

  const distTag = sanitizeBranchTag(branchName);
  const latestFeatureTag = getLatestFeatureTag(distTag, cwd);

  let featureTagVersion;
  if (latestFeatureTag) {
    const version = extractVersionFromTag(latestFeatureTag);
    const match = version.match(/^(\d+\.\d+\.\d+)-.*\.(\d+)$/);
    const base = match[1];
    const prerelease = parseInt(match[2], 10) + 1;
    featureTagVersion = `${base}-${distTag}.${prerelease}`;
  } else {
    const latestStableTag = getLatestStableTag(cwd);
    const baseVersion = extractVersionFromTag(latestStableTag);
    const patchVersion = bumpVersion(baseVersion, 'patch');
    featureTagVersion = `${patchVersion}-${distTag}.0`;
  }

  const releaseTag = `${PACKAGE_NAME}@${featureTagVersion}`;
  createAndPushTag(releaseTag, cwd);
  publishPackage(featureTagVersion, distTag, cwd);
  createGitHubRelease(releaseTag, featureTagVersion, true);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
