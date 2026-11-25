# Veritas

**Cryptographic Academic Certificate Registry & Instant Verification Platform**  

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Security](https://img.shields.io/badge/Hashing-SHA--256-4F46E5?style=flat-square)

Veritas is a zero-file-storage cryptographic registry for issuing, managing, and verifying academic credentials. Instead of storing sensitive student PDFs on disk or in third-party buckets, Veritas computes deterministic **SHA-256** fingerprints entirely in memory, pairs each credential with a scannable QR code, and lets employers or institutions verify authenticity in seconds.

---

## Key Features

- **Zero File Storage (In-Memory Pipeline):** Uploaded and generated PDFs are processed strictly as in-memory `Buffer` objects and discarded immediately after hashing—only the cryptographic digest and metadata are stored in MongoDB.
- **In-Memory PDF Certificate Generator:** Issuers can either upload an existing PDF or generate a **Printable Classic (A4 Landscape)** certificate on the fly using `pdfkit`, complete with the B.M.S. College of Engineering crest, unique Certificate ID (`CERT-XXXXXX`), embedded verification QR code, and SHA-256 fingerprint.
- **Dual-Mode Instant Verification:**
  - **File Verification:** Drop any PDF on `/verify` to recompute its SHA-256 hash and detect even a single byte of tampering.
  - **ID & QR Verification:** Enter a `CERT-XXXXXX` ID or scan the printed QR code (`/verify?id=CERT-XXXXXX`) for immediate status lookup.
- **Real-Time Revocation:** Authorized issuers can revoke compromised or erroneous credentials from the dashboard; verification endpoints immediately reflect `Valid`, `Revoked`, or `Not Verified` states.
- **Editorial UI & Route-Aware Live Backgrounds:** Designed with a cohesive dark-navy editorial aesthetic (`Newsreader`, `Inter`, `DM Mono`), unified Framer Motion page transitions, and custom interactive backgrounds per route.

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React + Vite)                            │
│  Landing (/)   •   Verify (/verify)   •   Dashboard (/dashboard)   •   Contact  │
└───────────────────────────────┬──────────────────────────┬─────────────────┘
                                │ HTTPS / REST (JWT)       │ Multipart / JSON
                                ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js + Express ESM)                      │
│                                                                            │
│  ┌──────────────────────────────────┐   ┌───────────────────────────────┐  │
│  │  ISSUANCE & GENERATION PIPELINE  │   │     VERIFICATION PIPELINE     │  │
│  │                                  │   │                               │  │
│  │  1. Validate payload (Zod)       │   │  1. Receive PDF in RAM        │  │
│  │  2. Generate CERT-XXXXXX & QR    │   │     (multer memoryStorage)    │  │
│  │  3. Render A4 PDF in RAM (pdfkit)│   │  2. Compute SHA-256 digest    │  │
│  │     OR read uploaded PDF Buffer  │   │     OR lookup by certId       │  │
│  │  4. Compute SHA-256 hashBuffer() │   │  3. Compare digest & status   │  │
│  │  5. Discard Buffer (0 disk I/O)  │   │  4. Return Valid / Revoked /  │  │
│  └────────────────┬─────────────────┘   │     Not Verified              │  │
│                   │                     └───────────────┬───────────────┘  │
└───────────────────┼─────────────────────────────────────┼──────────────────┘
                    │                                     │
                    ▼                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                            MONGODB (Mongoose)                              │
│   Issuers Collection (hashed creds)  •  Certificates (certId, fileHash,    │
│                                         metadata, status, issuedAt)        │
└────────────────────────────────────────────────────────────────────────────┘
```

### Security & Privacy Model
- **Tamper Evidence:** Any modification to a generated or issued PDF—including changing a single pixel, grade, or metadata byte—produces a completely different SHA-256 hash and fails file verification.
- **No Document Retention:** Because raw PDFs are never written to local storage or cloud buckets, the attack surface for student document leaks is eliminated.
- **Protected Issuance:** All certificate creation, generation, and revocation endpoints require a valid JWT issued via `/api/auth/login` and validated with Zod schemas.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React |
| **Visuals & Shaders** | Vanta.js (`NET` via Three.js, `TRUNK` via p5.js), Custom WebGL 8×8 Bayer Riso Dither Shader |
| **Backend** | Node.js (ESM), Express, Zod, Multer (memory storage), `pdfkit`, `qrcode` |
| **Database & Auth** | MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, Node `crypto` (SHA-256) |

### Route-Aware Visual Architecture

| Route | Purpose | Live Background |
| :--- | :--- | :--- |
| `/` | Editorial landing page, overview & animated FAQs | Ambient looping video (`/bg-loop.mp4`) |
| `/verify` & `/login` | Public certificate verification & issuer authentication | Interactive Vanta.js `NET` (Three.js) |
| `/dashboard` | Protected issuer portal, stats, table & PDF generator | Animated Vanta.js `TRUNK` (p5.js) |
| `/contact` | Creator profiles & GitHub links | Custom zero-dependency WebGL 8×8 Bayer Dither |

---

## API Reference

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate issuer and return JWT |
| `GET` | `/api/auth/me` | Protected | Fetch currently authenticated issuer profile |

### Certificates (Issuer Portal)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates` | Protected | List all issued certificates & dashboard stats |
| `POST` | `/api/certificates` | Protected | Issue a certificate from an uploaded PDF (in-memory hash) |
| `POST` | `/api/certificates/generate` | Protected | Generate an A4 Printable Classic PDF in memory, hash, store, and return Base64 PDF + QR |
| `PATCH` | `/api/certificates/:id/revoke` | Protected | Revoke an existing certificate |

### Public Verification
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/verify/file` | Public | Hash an uploaded PDF in memory and verify against the registry |
| `GET` | `/api/verify/:certId` | Public | Verify a certificate by its `CERT-XXXXXX` ID (supports QR deep-links) |

---

## Project Structure

```text
Veritas/
├── client/
│   ├── public/
│   │   └── bg-loop.mp4               # Landing page ambient video
│   └── src/
│       ├── components/
│       │   ├── AmbientBackground.jsx # Route-aware background router
│       │   ├── DitherBackground.jsx  # Custom WebGL 8x8 Bayer Riso Dither
│       │   ├── Layout.jsx            # Shared navbar & viewport shell
│       │   ├── dashboard/            # StatsCards, CertificateTable, IssueCertificateModal
│       │   ├── landing/              # HowItWorks, FaqSection
│       │   └── verify/               # FileDropzone, VerifyingStepper, VerifyResultCard
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── VerifyPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── DashboardPage.jsx
│       │   └── ContactPage.jsx
│       └── App.jsx
└── server/
    ├── assets/
    │   └── bmsce-logo.png            # Crest embedded in generated PDFs
    └── src/
        ├── controllers/              # auth, certificate, verify controllers
        ├── middleware/               # JWT auth & multer memory upload
        ├── models/                   # Issuer & Certificate Mongoose schemas
        ├── routes/                   # Express route definitions
        ├── services/                 # Business logic & in-memory issuance
        └── utils/
            ├── hash.js               # SHA-256 buffer hashing
            └── pdfGenerator.js       # A4 Landscape Printable Classic PDF builder
```

---

## Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local instance or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone [https://github.com/Krish-y25/Veritas.git](https://github.com/Krish-y25/Veritas.git)
cd Veritas
```

### 2. Configure the Server
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/veritas
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Make sure the institution crest exists at `server/assets/bmsce-logo.png`, then start the backend:
```bash
npm run dev
```

*(If your repository includes a seed script for the demo issuer account, run it once before logging in—for example `npm run seed`.)*

### 3. Configure & Run the Client
Open a second terminal:
```bash
cd client
npm install
```

Create a `.env` file inside `/client` (if using a custom API base URL):
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---


## License

This project is licensed under the MIT License.