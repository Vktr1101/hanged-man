# Hanged Man

A full-stack **hangman** game (in English), built to help develop vocabulary. The app features user accounts, a game history, per-user personalized words, and an animated interface.

**Live:** [https://hanged-man-doh2.onrender.com](https://hanged-man-doh2.onrender.com)

> Note: the app is hosted on Render's free plan, so the first visit after a period of inactivity may take around 50 seconds (the server needs to "wake up").

---

## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database](#database)
- [API Routes](#api-routes)
- [Running Locally](#running-locally)
- [Hosting on Render](#hosting-on-render)
- [Features](#features)

---

## Description

The player guesses an English word letter by letter. Each wrong guess progressively draws part of the gallows (SVG). After 10 wrong guesses the game is lost; if the player completes the word first, it is won.

Users can create an account, log in, and view their game history (with filters). Words a user has already **won** are not repeated for them; lost words can reappear.

---

## Technologies

**Frontend**
- HTML, CSS (Flexbox layout, `@keyframes` animations, responsive design with media queries)
- JavaScript (DOM, `fetch`, `async/await`)

**Backend**
- Node.js
- Express (web server + API + serving static files)
- express-session (authentication sessions)
- bcrypt (password hashing)

**Database**
- SQLite, via `better-sqlite3`

**Hosting**
- Render (Web Service)

---

## Architecture

The app is **client-server**, served entirely by a single Express server.

```
Browser (frontend)  <-- HTTP / fetch -->  Express server  <-->  SQLite (local file)
```

- The **Express server** does two things at once:
    1. serves the frontend files (HTML/CSS/JS) via `express.static`
    2. responds to API requests (`/api/...`) with JSON data
- The **frontend** contains no sensitive logic: it requests data from the server via `fetch` (words, login, history) and displays it.
- **Sessions** track who is authenticated across requests, through a cookie the browser sends automatically.
- The **database** is a simple SQLite file, read/written directly by the server via `better-sqlite3`.

A game flow, in short:
1. On `Play`, the frontend requests a word from `/api/cuvant`.
2. The server randomly picks a word the logged-in user has **not already won**.
3. The user guesses letters (physical keyboard or on-screen keyboard).
4. At the end, the result is sent to `/api/game` and stored in the database.

---

## Project Structure

```
hanged-man/
├── backend/
│   ├── server.js        # Express server: API routes + serving the frontend
│   ├── database.js      # SQLite connection, table creation, word seeding
│   ├── words.json       # 950 English words (5-12 letters)
│   └── hangedman.db     # SQLite database (auto-generated, git-ignored)
├── frontend/
│   ├── index.html       # home + game (single page)
│   ├── login.html
│   ├── register.html
│   ├── history.html
│   ├── style.css
│   ├── index.js         # game logic + auth in the header
│   ├── login.js
│   ├── register.js
│   ├── history.js
│   └── hangman.png      # every page's icon
├── package.json         # dependencies + scripts
├── package-lock.json  
├── .gitignore
└── README.md
```

`package.json` is located in the **root** of the project, and the server is started from the root with `node backend/server.js`.

---

## Database

Three tables, created automatically when the server starts (`database.js` runs on `import`):

**Users**

| column   | type    | notes             |
|----------|---------|-------------------|
| id       | INTEGER | PK, autoincrement |
| username | TEXT    | UNIQUE, NOT NULL  |
| email    | TEXT    | UNIQUE, NOT NULL  |
| password | TEXT    | bcrypt hash       |

**Games**

| column   | type    | notes                      |
|----------|---------|----------------------------|
| id       | INTEGER | PK, autoincrement          |
| userId   | INTEGER | references Users(id)       |
| word     | TEXT    | the word played            |
| result   | TEXT    | `win` / `lose`             |
| mistakes | INTEGER | number of wrong guesses    |
| date     | TEXT    | date (ISO)                 |

**Words**

| column | type    | notes             |
|--------|---------|-------------------|
| id     | INTEGER | PK, autoincrement |
| word   | TEXT    | UNIQUE, NOT NULL  |

The `Words` table is **seeded automatically** from `words.json` on first startup (if empty), using a transaction for fast insertion.

The user-to-words relationship is implicit in `Games`: "words won by a user" = rows in `Games` where `userId = X` and `result = 'win'`.

---

## API Routes

| Method | Route                  | Description                                            |
|--------|------------------------|-------------------------------------------------------|
| GET    | `/api/cuvant`          | A random word (excludes words the user has won)       |
| POST   | `/api/register`        | Creates an account (hashes password, starts session)  |
| POST   | `/api/login`           | Authentication                                        |
| POST   | `/api/logout`          | Destroys the session                                  |
| GET    | `/api/me`              | Who is currently authenticated                        |
| POST   | `/api/game`            | Saves a finished game                                 |
| GET    | `/api/games`           | Game history of the logged-in user                    |
| POST   | `/api/delete-account`  | Deletes the account and its games                     |

Passwords are never stored in plain text — only as bcrypt hashes. The `userId` is always taken from the session (not from the request), for security.

---

## Running Locally

**Requirements:** Node.js installed.

```bash
# 1. clone the repo
git clone https://github.com/Vktr1101/hanged-man.git
cd hanged-man

# 2. install dependencies
npm install

# 3. start the server
node backend/server.js
```

Then open in your browser:

```
http://localhost:3000
```

The database (`hangedman.db`) and the words are created **automatically** on first startup — nothing needs to be run separately.

> Important: access the app through `localhost:3000` (the Express server), not through a separate development server, because the API (`/api/...`) is served by Express.

---

## Hosting on Render

The app is hosted as a **Web Service** on Render, connected to the GitHub repository.

**Configuration:**
- **Build Command:** `npm install`
- **Start Command:** `node backend/server.js`
- **Root Directory:** (empty — everything runs from the root)
- **Port:** the server reads the port from `process.env.PORT` (provided by Render), with a fallback to 3000 for local use

**Auto-deploy:** on every `push` to the `main` branch, Render automatically rebuilds and restarts the app.

**Important note about paths:** because Render runs the server from the root, the paths to `words.json` and `hangedman.db` are built absolutely, relative to the file's location, using `__dirname` (via `fileURLToPath(import.meta.url)`). Without this, the files would not be found.

**Free plan limitations:**
- the server "spins down" after ~15 minutes of inactivity and takes ~30s to start again on the next visit;
- the SQLite database sits on an **ephemeral** disk, so it resets on every redeploy — accounts and games created online can be lost when a new version is deployed. (Real persistence would require a persistent volume or a separately hosted database.)

---

## Features

- Hangman game with a progressive SVG drawing
- Input from both the physical keyboard **and** an on-screen keyboard (for mobile)
- Registration and login with hashed passwords (bcrypt) and sessions
- Per-user game history, filterable by date and result
- Personalized words: words already won are not repeated for that user
- Transitions and animations (fade, slide, "tada", drop-in)
- Responsive design (desktop + mobile)
- Automatic deployment to Render on every push

---

## Possible Future Improvements

- Google authentication (OAuth2)
- Password reset via email
- Migration to a persistent database (PostgreSQL) or a persistent volume
- Rewriting the frontend in React