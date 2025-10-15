const fs = require('fs');
try { fs.rmSync('./public', { recursive: true, force: true }); } catch {}
fs.mkdirSync('./public', { recursive: true });