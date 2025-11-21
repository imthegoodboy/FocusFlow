# FocusFlow Frontend

Next.js 14 frontend application for FocusFlow.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Features

- User authentication (login/register)
- Profile setup wizard
- Routine survey
- Dashboard with:
  - Task management
  - Routine logging
  - Analytics charts
  - AI recommendations
  - Notifications
  - Streaks display

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (for analytics)
- React Hook Form
- Axios (API client)

## Project Structure

- `app/` - Next.js app directory with pages
- `components/` - Reusable React components
- `lib/` - Utility functions and API client

