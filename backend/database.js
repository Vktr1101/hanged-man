import Database from 'better-sqlite3';

const db = new Database('hangedman.db');

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

export default db;