# ZEUS Frontend

Next.js app for the luxury Athens booking platform.

**Live:** [book.yazmin.dev](https://book.yazmin.dev)

See the [root README](../README.md) for full setup, deployment, and architecture.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `BACKEND_INTERNAL_URL=http://127.0.0.1:4000` in `.env.local`.

## Deploy (Vercel)

- Root directory: `book`
- Required env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `BACKEND_INTERNAL_URL`
