# Veritas: project rules (read before every task)

## What we are building
Veritas, a certificate verification web app for a college demo, built in about 3 hours.
Stack: Node.js + Express + MongoDB (Mongoose) in /server; React + Vite + Tailwind + shadcn/ui + lucide-react + Framer Motion in /client.

## Core idea
Issuers upload certificate PDFs. The server hashes the PDF bytes (SHA-256, in memory, file NOT stored) and saves the hash plus student details.
Anyone can upload a PDF to verify: hash it and look up fileHash.
Results: valid, revoked, not found.
Unique index on fileHash. Certificate IDs are random (CERT-XXXXXX). The QR links to /verify?id=<certId>.

## API (fixed, do not rename or add routes)
POST /api/auth/login
POST /api/certificates (multipart, auth)
GET /api/certificates (auth, search)
PATCH /api/certificates/:id/revoke (auth)
POST /api/verify/file (public, rate limited, multipart)
GET /api/verify/:certId (public)
GET /api/stats (auth)

## Screens in scope (only these)
Landing, Verify (with verify-by-ID tab), Login, Dashboard (stat cards, certificates table, Issue modal).

## Scope lock
- Do ONLY the task I give you in the current message. Nothing extra.
- Do not add features, pages, routes, fields, or UI that I did not ask for.
- Do not refactor, rename, reformat, or "improve" files unrelated to the current task.
- If you think something outside the task needs changing, tell me and wait. Do not do it.
- If a request conflicts with these rules, stop and ask.

## Out of scope (do not build, even if it seems helpful)
Charts, verification history page, settings, registration, admin roles, bulk CSV, blockchain, text-based altered-copy detection, tests, deployment config, file storage of PDFs.

## Code rules
- Architecture: routes -> controllers -> services -> models. Small files (under ~150 lines), one responsibility each.
- Plain JavaScript, clear names, comments explain WHY, not what.
- Validate input with Zod. One central error handler.
- Secrets only in .env. Never print, log, or commit secrets.
- Do not add dependencies without asking me first, and tell me why each is needed.

## Safety rules
- Do not delete files, run destructive commands, force-push, or change Git history.
- Do not commit. I will commit myself.
- Do not overwrite working code when fixing a bug. Make the smallest change that fixes it.

## Design (frontend)
Dark theme, navy background, indigo-to-cyan gradient accent, glass cards, Inter font.
Motion only on the hero and the verification result. Use shadcn/ui components instead of building custom ones.

## How to work
- One small step at a time, then stop and wait for my confirmation.
- After each task, list: files changed, what you did, and how I can test it.