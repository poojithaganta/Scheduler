# TARDUS Scheduler Backend (Spring Boot + PostgreSQL)

## Prerequisites
- Java 17+
- PostgreSQL 14+

## Configuration
Environment variables (with defaults):
- `DB_URL` (default `jdbc:postgresql://localhost:5432/tardus`)
- `DB_USER` (default `postgres`)
- `DB_PASSWORD` (default `postgres`)
- `UPLOAD_DIR` (default `uploads`)
- `CORS_ORIGINS` (default `http://localhost:5173`)

## Database
Create database and let Spring initialize tables from `schema.sql`:
```sql
CREATE DATABASE tardus;
```

## Run
```bash
./gradlew bootRun
```
Server runs on `http://localhost:8080`.

## API
POST `/api/employees` (multipart/form-data):
- fields: `name`, `email`, `phone`, `address`, `officeLocation`
- file: `resume` (optional)

Response:
```json
{ "success": true, "id": 1, "officeLocation": "Irving" }
```

Uploads stored under `UPLOAD_DIR`.

