# Eodum GDR

This project contains a Node.js backend and a React frontend. The backend can connect either to a local PostgreSQL instance or to a remote Render PostgreSQL database.

## Configuration

1. Copy `backend/.env.example` to `backend/.env`.
2. If you want to use the Render database, uncomment `DATABASE_URL` in `backend/.env` and make sure the connection string matches your Render dashboard.
3. Otherwise leave `DATABASE_URL` commented and adjust the local database settings.

The frontend can optionally use `VITE_API_URL` to override the default API endpoint when running locally or in production.
