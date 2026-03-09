# Catmon - Choose Your Own Adventure Studio

A creator tool to build branching stories, plus a player mode to experience them. Pokemon-themed but with cats.

## Tech Stack

- **Frontend**: Angular 21, Bootstrap 5, TypeScript
- **Backend**: Node.js, Express.js 4, TypeScript
- **Database**: MongoDB 7 with Mongoose ODM
- **Auth**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Containerization**: Docker & Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installing Docker Desktop

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system (macOS or Windows).

## Project Structure

```
├── api/                        # Express.js backend
│   └── src/
│       ├── config/             # Environment, database, Swagger config
│       ├── controllers/        # UserController, StoryController, StoryNodeController
│       ├── middlewares/        # JWT auth middleware
│       ├── models/             # Mongoose schemas (User, Story, StoryNode)
│       ├── routes/             # API route definitions
│       └── server.ts           # Express app entry point
├── frontend/                   # Angular 21 app
│   └── src/app/
│       ├── @core/              # Guards, interceptors, services, layout
│       ├── feature/
│       │   ├── user/           # Login, Register, Home, Profile
│       │   ├── story-editor/   # Story CRUD, node editor with branching choices
│       │   └── story-player/   # Browse and play published stories
│       └── environments/       # Environment configs
├── mongo/                      # MongoDB init scripts
├── docker-compose.yml          # Multi-container orchestration
└── .env.example                # Environment variable template
```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MindflayerSpr26
   ```

2. Start all services:
   ```bash
   docker compose up --build
   ```

3. Access the app:
   - **Frontend**: http://localhost:4000
   - **API**: http://localhost:3000/api
   - **Swagger Docs**: http://localhost:3000/api/docs
