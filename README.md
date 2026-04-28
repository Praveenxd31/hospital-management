# Hospital Management Platform — Setup Guide

## Prerequisites

- Node.js >= 18
- PostgreSQL running locally
- Yarn installed (`npm install -g yarn`)

---

## Backend Setup

```bash
cd backend
yarn install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/hospital_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Run migrations:

```bash
yarn prisma:migrate
```

Generate Prisma client:

```bash
yarn prisma:generate
```

Seed the database:

```bash
yarn seed
```

Start the server:

```bash
yarn dev
```

Runs at `http://localhost:5000`

---

## Frontend Setup

```bash
cd frontend
yarn install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the app:

```bash
yarn dev
```

Runs at `http://localhost:5173`

---

## Login

```
Email:    admin@gmail.com
Password: admin123
```