const fs = require('fs');
const path = require('path');

const metaPath = path.join(__dirname, "../public/meta.json");
 
const meta = require(metaPath);

// Generate a random version (e.g., 1.0.12345)
meta.version = Date.now();

fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
console.log(`Version updated to ${meta.version}`);