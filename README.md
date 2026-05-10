# MacroFlow 🍽️

A mobile recipe book app that automatically imports ingredients and directions from a recipe URL.

## Stack

- React Native (Expo) — mobile
- Python FastAPI — backend
- PostgreSQL — database
- Docker — containerization

## Running the App

**Backend:**

```bash
docker compose up
```

**Mobile:**

```bash
cd mobile
npx expo start --tunnel
```

## Notes

- Copy `backend/.env.example` to `backend/.env` and fill in your values
- API docs available at `http://localhost:8000/docs`
