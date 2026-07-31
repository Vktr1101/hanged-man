import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

const cuvinte = ['javascript', 'programare', 'monitor', 'dreptunghi', 'elefant'];

app.get('/api/cuvant', (req, res) => {
    const cuvant = cuvinte[Math.floor(Math.random() * cuvinte.length)];
    res.json({ cuvant: cuvant });
});

app.listen(PORT, () => {
    console.log(`Server pornit pe http://localhost:${PORT}`);
});