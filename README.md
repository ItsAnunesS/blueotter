# BlueOtter Backend Challenge

## Description

This project is a backend solution developed in Node.js with NestJS to interact with and manipulate GitHub user data. It allows synchronizing public repositories of a GitHub user into a local PostgreSQL database and provides endpoints to list, search, and analyze the stored data.

For more details about the challenge requirements, please refer to [CHALLENGE.md](CHALLENGE.md).

## Technologies

- [NestJS](https://nestjs.com/) - A progressive Node.js framework.
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - Relational database.
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - Containerization.

## How to Run

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Steps

1.  Clone the repository.
2.  Create a `.env` file based on `.env.example` (if available) or ensure the environment variables in `docker-compose.yml` are sufficient.
3.  Run the application using Docker Compose:

```bash
docker compose up -d
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Repositories

#### Sync User Repositories

Copies all public repositories of a given GitHub user into the local database.

- **URL:** `/repos/sync/:user`
- **Method:** `POST`
- **URL Params:**
  - `user`: GitHub username
- **Success Response:**
  - Code: 200 OK
  - Content: Object containing synchronization details.

#### Get User Repositories

Lists all repositories stored in the local database for a specific user.

- **URL:** `/repos/:user`
- **Method:** `GET`
- **URL Params:**
  - `user`: GitHub username
- **Success Response:**
  - Code: 200 OK
  - Content: Array of repository objects.

#### Search Repositories

Searches for repositories stored in the local database matching the search query.

- **URL:** `/repos`
- **Method:** `GET`
- **Query Params:**
  - `search`: Keywords to match against repository data (optional).
- **Success Response:**
  - Code: 200 OK
  - Content: Array of repository objects.

#### Get Analytics

Returns statistics computed from the synchronized local data.

- **URL:** `/repos/analytics`
- **Method:** `GET`
- **Query Params:**
  - `user`: GitHub username (optional). If provided, returns stats for that user. If not, returns global stats.
  - `topN`: Number of top users to return (optional, default: 5).
- **Success Response:**
  - Code: 200 OK
  - Content: Analytics object containing summary, language stats, top users (global only), and timeline.

## Swagger Documentation

You can access the Swagger API documentation at `http://localhost:3000/swagger`.
