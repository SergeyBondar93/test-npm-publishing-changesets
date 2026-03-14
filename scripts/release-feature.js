const {
  PACKAGE_NAME,
  getLatestStableTag,
  extractVersionFromTag,
  bumpVersion,
  sanitizeBranchTag,
  getLatestFeatureTag,
  createAndPushTag,
} = require('./release-utils');

function main() {
  const branchName = process.argv[2];
  const cwd = process.cwd();

  const distTag = sanitizeBranchTag(branchName);
  const latestFeatureTag = getLatestFeatureTag(distTag, cwd);

  let baseVersion;
  if (latestFeatureTag) {
    const featureVersion = extractVersionFromTag(latestFeatureTag);
    baseVersion = featureVersion.replace(`-${distTag}`, '');
  } else {
    const latestStableTag = getLatestStableTag(cwd);
    baseVersion = extractVersionFromTag(latestStableTag);
  }

  const patchVersion = bumpVersion(baseVersion, 'patch');
  const featureTagVersion = `${patchVersion}-${distTag}`;

  const releaseTag = `${PACKAGE_NAME}@${featureTagVersion}`;
  createAndPushTag(releaseTag, cwd);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
