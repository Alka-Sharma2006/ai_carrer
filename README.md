# CareerCompass AI

An AI-powered career guidance MVP built with React, Redux Toolkit, Node.js, Express, MongoDB, and Gemini.

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string
- A Google Gemini API key

## Setup

From the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open a second terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edit .env and set MONGODB_URI and GEMINI_API_KEY
npm run dev
```

The frontend runs at `http://localhost:5173`; the backend runs at `http://localhost:5000`.

## API endpoints

- `GET /api/health`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `GET /api/careers`
- `POST /api/careers/recommend`
- `POST /api/ai/roadmap`
- `POST /api/ai/chat`
