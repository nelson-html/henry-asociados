const fs = require('fs');
if (fs.existsSync('./src/js')) fs.cpSync('./src/js', './public/js', { recursive: true });