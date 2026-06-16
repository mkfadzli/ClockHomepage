# Clock Homepage
# Author: Fadzli Abdullah


Modern alarm clock and search dashboard built with React + Vite. Runs as a local dev server or in Docker (Nginx) — ideal as a Firefox homepage or always-on desktop clock.

## Quick start

### Option 1: One-click launcher (Windows)

```bat
run.bat
```

Choose **1** for the Vite dev server or **2** for Docker.

### Option 2: Dev server

```bash
cd alarm-timer
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Option 3: Docker

```bash
cp .env.example .env
docker compose up -d
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

| Path | Description |
|------|-------------|
| `alarm-timer/` | React + Vite frontend |
| `windows-startup/` | Windows Task Scheduler scripts for auto-start |
| `docker-compose.yml` | Single-command Docker deploy |
| `Dockerfile` | Multi-stage build (Node → Nginx) |

## License

Courtesy of Hetnet Wireless Technologies.
