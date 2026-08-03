import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'hangedman.db'));

db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        word TEXT NOT NULL,
        result TEXT NOT NULL,
        date TEXT NOT NULL,
        mistakes INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS Words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE NOT NULL
    )
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM Words').get().n;
if (count === 0) {
    const cuvinte = JSON.parse(readFileSync(path.join(__dirname, 'words.json'), 'utf-8'));
    const insert = db.prepare('INSERT OR IGNORE INTO Words (word) VALUES (?)');
    const insertMany = db.transaction((lista) => {
        for (const cuvant of lista) insert.run(cuvant);
    });
    insertMany(cuvinte);
    console.log(`${cuvinte.length} cuvinte incarcate in Words`);
}

export default db;