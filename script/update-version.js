const { writeFileSync } = require("fs");
const { version: _version } = require("../package.json");

const versionData = {
  version: _version
};

writeFileSync("version.json", JSON.stringify(versionData, null, 2));
console.log(`✅ version.json created: v${_version}`);
