# Node.js + Express + PostgreSQL + Sequelize CRUD Application

A production-ready RESTful CRUD application built with Node.js, Express, PostgreSQL running in Docker, and Sequelize ORM. Includes an interactive modern web dashboard to visually test and interact with all CRUD operations.

---

## 🚀 Features

- **Backend Framework**: Express.js with modular MVC architecture (Routes, Controllers, Models, Config).
- **ORM**: Sequelize with PostgreSQL dialect (`pg` & `pg-hstore`).
- **Database**: PostgreSQL 16 running in an isolated Docker container with healthcheck and persistent volumes.
- **Auto Sync**: Automatic model synchronization (`sequelize.sync()`).
- **Input Validation & Error Handling**: Centralized error middleware handling Sequelize validation and HTTP status codes.
- **Interactive UI Dashboard**: Modern glassmorphic web interface served at `http://localhost:5000` to create, read, update, filter, search, and delete records visually.
- **RESTful JSON API**: Clean endpoints with standard HTTP status codes (`200`, `201`, `400`, `404`, `500`).

---

## 📁 Project Structure

```
chatapp/
├── docker-compose.yml       # PostgreSQL Docker container configuration
├── .env                     # Local environment variables
├── .env.example             # Example environment variables template
├── .gitignore
├── package.json
├── server.js                # App entrypoint (DB authentication & server listener)
└── src/
    ├── app.js               # Express app config, middlewares & routes
    ├── config/
    │   └── database.js      # Sequelize instance and connection pool
    ├── controllers/
    │   └── item.controller.js # CRUD handlers (create, getAll, getById, update, delete)
    ├── middlewares/
    │   └── errorHandler.js  # Global error handler
    ├── models/
    │   ├── index.js         # Model index and sync helper
    │   └── item.model.js    # Item entity schema
    ├── public/              # Visual frontend interface
    │   ├── index.html       # Dashboard HTML
    │   ├── style.css        # Glassmorphic dark styling
    │   └── app.js           # Client-side API interactions
    └── routes/
        └── item.routes.js   # REST API routes
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) and Docker Compose

### 2. Start PostgreSQL via Docker
```bash
docker compose up -d
# or using npm script:
npm run db:up
```

Verify the container is healthy:
```bash
docker ps
```

### 3. Start the Express Application
```bash
# Production mode:
npm start

# Development mode (with nodemon):
npm run dev
```

The application will be accessible at:
- **Web Dashboard**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **JSON API**: [http://localhost:5000/api/items](http://localhost:5000/api/items)

---

## 📡 API Reference (`/api/items`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Retrieve all items (supports `?search=`, `?status=`, `?category=`, `?priority=`) |
| `GET` | `/api/items/:id` | Retrieve a specific item by ID |
| `POST` | `/api/items` | Create a new item |
| `PUT` | `/api/items/:id` | Update an existing item by ID |
| `DELETE` | `/api/items/:id` | Delete an item by ID |

---

## 🧪 Testing with cURL

### 1. Create a New Item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Configure Database Backups",
    "description": "Set up automated WAL archiving and pg_dump cron jobs",
    "category": "DevOps",
    "status": "pending",
    "priority": "high"
  }'
```

### 2. Get All Items
```bash
curl -X GET http://localhost:5000/api/items
```

### 3. Filter or Search Items
```bash
curl -X GET "http://localhost:5000/api/items?status=pending&search=Database"
```

### 4. Get a Single Item by ID
```bash
curl -X GET http://localhost:5000/api/items/1
```

### 5. Update an Item
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "medium"
  }'
```

### 6. Delete an Item
```bash
curl -X DELETE http://localhost:5000/api/items/1
```

---

## 🛑 Stopping the Database
```bash
npm run db:down
# or
docker compose down
```
