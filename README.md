# PlanForge — Digital Product Marketplace

A MERN-stack marketplace connecting project management template creators (sellers)
with practitioners (customers). Built for IFN636 Assessment.

## Structure
```
planforge-marketplace/
  backend/    Express + MongoDB API (JWT auth, products, purchases)
  frontend/   React app (catalogue, seller dashboard, checkout, etc.)
```

## Covers (mapped to your backlog)
- Epic 1 — Registration, login, JWT-based role access
- Epic 2 — Seller create/read/update/delete product listings
- Epic 3 — Customer browse + filter catalogue, product details
- Epic 4 — Simulated checkout, purchase history, file access via URL

## Local setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev            # starts on http://localhost:5000
```

Get a free `MONGO_URI` from MongoDB Atlas: create a cluster, add a database user,
allow network access from your IP (or 0.0.0.0/0 for EC2 testing), and copy the
connection string into `.env`.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # points at your backend URL
npm start               # starts on http://localhost:3000
```

## Deploying to EC2
1. Push this whole folder to GitHub (see .gitignore — it already excludes
   node_modules and .env).
2. On EC2: clone the repo, `npm install` in both `backend/` and `frontend/`.
3. In `backend/`, create `.env` with your real Mongo URI and JWT secret.
4. In `frontend/`, set `REACT_APP_API_URL` to `http://<ec2-ip>:5000/api`, then
   `npm run build` to produce a static `build/` folder.
5. Run the backend with PM2 (`pm2 start server.js --name planforge-api`).
6. Serve the frontend `build/` folder with Nginx (or `serve -s build`), and
   have Nginx reverse-proxy `/api` requests to the backend on port 5000.
