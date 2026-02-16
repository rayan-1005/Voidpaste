# VoidPaste

VoidPaste is a fast, minimal, and privacy‑focused Pastebin clone built
with Node.js, Express, and Supabase.

It allows you to create, share, and manage text pastes with expiration
and view‑once support. Designed with a sleek Catppuccin Mocha theme and
lightweight architecture.

---

## Features

- Create and share text pastes instantly
- Unique short ID per paste
- Clean browser viewer
- Raw text access via curl
- Expiration support
- View‑once pastes
- Copy link button
- Persistent storage using Supabase
- Lightweight frontend

---

## Installation

Clone:

git clone https://github.com/rayan-1005/voidpaste.git

cd voidpaste/backend

Install dependencies:

npm install

Create .env file:

PORT=5000\
SUPABASE_URL=your_url\
SUPABASE_KEY=your_key

Run:

npm run dev

Open:

http://localhost:5000

---

## Usage

Create paste in browser:

http://localhost:5000

View paste:

http://localhost:5000/view/`<pasteId>`

Example:

http://localhost:5000/view/zRTKh

---

## curl API Usage

Create paste:

curl -X POST http://localhost:5000/paste -H "Content-Type:
application/json" -d "{\"content\":\"Hello VoidPaste\"}"

Response:

{"pasteId":"abc12"}

Fetch paste raw:

curl http://localhost:5000/paste/abc12

Fetch paste JSON:

curl -H "Accept: application/json" http://localhost:5000/paste/abc12

---

## Database Schema

Table: pastes

Columns:

id TEXT PRIMARY KEY\
content TEXT\
title TEXT\
created_at TIMESTAMP\
expires_at TIMESTAMP\
view_once BOOLEAN

---

## Architecture

Browser interface:

/view/:id → HTML viewer

API interface:

/paste/:id → raw text or JSON

---

## Future Development

- Raw endpoint
- Download endpoint
- Password protection
- Private pastes
- Syntax highlighting
- User accounts
- CLI client
- Docker deployment
- Public paste listing
- Search

---

## License

MIT License

---

VoidPaste --- your code, the void remembers.
