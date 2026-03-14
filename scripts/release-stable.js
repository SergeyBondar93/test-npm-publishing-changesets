const {
  PACKAGE_NAME,
  getLatestStableTag,
  extractVersionFromTag,
  bumpVersion,
  createAndPushTag,
} = require('./release-utils');

function main() {
  const releaseType = process.argv[2];
  const cwd = process.cwd();

  const latestStableTag = getLatestStableTag(cwd);
  const baseVersion = extractVersionFromTag(latestStableTag);
  const newVersion = bumpVersion(baseVersion, releaseType);

  const releaseTag = `${PACKAGE_NAME}@${newVersion}`;
  createAndPushTag(releaseTag, cwd);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
