import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

// endpoint local
app.post('/api/agenda', (req, res) => {
  // valida req.body
  res.json({ ok: true, received: req.body });
});

// estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('http://localhost:5174'));
