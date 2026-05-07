@AGENTS.md
## Authentication
- Use NextAuth.js v5 (Auth.js) with @auth/prisma-adapter
- Email + password credentials only
- No registration page — accounts created manually
- Protect all routes under /(dashboard)/ with middleware
- Do NOT use Clerk, Neon Auth, or Supabase Auth