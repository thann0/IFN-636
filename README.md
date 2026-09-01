# PlanForge — Digital Product Marketplace

A MERN-stack marketplace where project management template creators (sellers) can
list their templates, and practitioners (customers) can browse and buy them.
Built for IFN636 Assessment.


## What's covered (mapped to the backlog)

- Epic 1 — Registration, login, JWT-based role access
- Epic 2 — Sellers can create, read, update, and delete their product listings
- Epic 3 — Customers can browse/filter the catalogue and view product details
- Epic 4 — Simulated checkout, purchase history, file access via URL

## Running it locally

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # runs on http://localhost:5000
```

You'll need a MongoDB Atlas connection string for `MONGO_URI`. Spin up a free
cluster, add a database user, whitelist your IP under Network Access, and
copy the connection string into `.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # point this at your backend URL
npm start               # runs on http://localhost:3000
```

## Deploying to EC2

1. Push the project to GitHub — `.gitignore` already excludes `node_modules`
   and `.env`, so no secrets get committed.
2. On the EC2 instance, clone the repo and run `npm install` in both
   `backend/` and `frontend/`.
3. Create a `.env` file in `backend/` with the real Mongo URI and JWT secret
   (this stays on the server, never in git).
4. Build the frontend: `npm run build` inside `frontend/`.
5. The backend is set up to serve the frontend's built files directly —
   Express serves the `build/` folder as static content and falls back to
   `index.html` for any route it doesn't recognise, so React Router keeps
   working. That means everything runs as one process on one port, with no
   separate frontend server needed.
6. Start it with PM2:
```bash
   pm2 start server.js --name digitalproduct
```
7. Visit `http://<ec2-public-ip>:5000` — that's your live app.

## Live deployment

- **URL:** http://54.253.103.47:5000
- **EC2 instance:** i-0ba7d68115caf1294 (ap-southeast-2, Sydney)

## Known limitations

- The EC2 security group currently restricts access to a small set of
  whitelisted IPs rather than being open to everyone — the AWS environment
  used for this course auto-removes fully open (0.0.0.0/0) inbound rules,
  so access has to be scoped to specific IPs instead. If you're trying to
  reach the live URL and it's not loading, that's probably why — get in
  touch and I can whitelist your IP.
- No automated tests yet.
- No password reset flow.
