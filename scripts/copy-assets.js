const fs = require('fs');
if (fs.existsSync('./src/assets')) fs.cpSync('./src/assets', './public/assets', { recursive: true });