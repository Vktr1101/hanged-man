import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';
import bcrypt from 'bcrypt';
import session from 'express-session';

const app = express();
app.use(express.json());
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(session({
    secret: 'cheie-secreta-hanged-man',
    resave: false,
    saveUninitialized: true
}));

app.get('/api/cuvant', (req, res) => {
    let cuvant;

    if (req.session.user) {
        cuvant = db.prepare(`
            SELECT word FROM Words
            WHERE word NOT IN (
                SELECT word FROM Games WHERE userId = ? AND result = 'win';
                )
                ORDER BY RANDOM() LIMIT 1
        `).get(req.session.user.id);
    } else {
        cuvant = db.prepare('SELECT word FROM Words ORDER BY RANDOM() LIMIT 1').get();
    }

    res.json({ cuvant: cuvant.word });
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Toate campurile sunt obligatorii!' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);

        const result = db.prepare('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)')
            .run(username, email, hash);

        req.session.user = { id: result.lastInsertRowid, username: username };
        res.json({ success: true, message: 'Cont creat cu succes!' });
    } catch (e) {
        res.status(400).json({ error: 'Username sau email deja folosit!' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Toate campurile sunt obligatorii!' });
    }

    const user = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);

    if (!user) {
        return res.status(400).json({ error: 'Username sau parola gresita!' });
    }

    const found = await bcrypt.compare(password, user.password);

    if (!found) {
        return res.status(400).json({ error: 'Username sau parola gresita!' });
    }

    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true, message: 'Autentificare reusita!' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/game', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Trebuie sa fii conectat pentru a vedea istoricul!' });
    }

    const { word, result, mistakes } = req.body;
    const date = new Date().toISOString();

    db.prepare('INSERT INTO Games (userId, word, result, mistakes, date) VALUES (?, ?, ?, ?, ?)')
        .run(req.session.user.id, word, result, mistakes, date);

    res.json({ success: true });
});

app.get('/api/games', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Trebuie sa fii conectat pentru a vedea istoricul!' });
    }

    const games = db.prepare('SELECT word, result, mistakes, date FROM Games WHERE userId = ? ORDER BY date DESC')
        .all(req.session.user.id);

    res.json({ success: true, games });
});

app.listen(PORT, () => {
    console.log(`Server pornit pe http://localhost:${PORT}`);
});