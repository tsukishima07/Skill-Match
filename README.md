# ⚡ SkillMatch AI

**AI-powered resume intelligence** — Match your resume against any job description using TF-IDF, cosine similarity, and smart skill extraction.

---

## 📁 Project Structure

```
skillmatch/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Sticky navbar with user menu
│   │   │   └── Dropzone.tsx     # Drag-and-drop file upload
│   │   ├── hooks/
│   │   │   └── useAuth.tsx      # Firebase auth context + demo login
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx    # Google sign-in + demo mode
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── UploadPage.tsx   # Resume + JD upload / job role input
│   │   │   └── ResultsPage.tsx  # Charts, skills, suggestions
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── api.ts           # Axios wrapper
│   │   │   └── firebase.ts      # Firebase init
│   │   ├── App.tsx              # Router + protected routes
│   │   ├── main.tsx
│   │   └── index.css            # Design system tokens + animations
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── backend/                     # Node.js + Express
    ├── routes/
    │   └── analyze.js           # POST /api/analyze, POST /api/analyze/text
    ├── services/
    │   ├── nlpService.js        # TF-IDF + cosine similarity + skill extraction
    │   ├── fileService.js       # PDF / DOCX text extraction
    │   └── jobApiService.js     # Adzuna API + smart mock fallback
    ├── utils/
    │   └── skills.js            # 300+ predefined skills taxonomy
    ├── server.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Clone / download the project

```bash
cd skillmatch
```

### 2. Backend setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — at minimum set PORT=5000
# (Adzuna keys optional — smart mock fallback works without them)

npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend setup

```bash
cd ../frontend
npm install

# Copy environment file
cp .env.example .env
# Fill in your Firebase credentials (see Firebase Setup below)
# VITE_API_URL=http://localhost:5000 is pre-configured

npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔥 Firebase Setup (for Google Login)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project → **Add web app**
3. Copy config values into `frontend/.env`:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. In Firebase Console → **Authentication** → **Sign-in method** → enable **Google**
5. Add `http://localhost:5173` to **Authorized domains**

> **No Firebase?** Click **"Try Demo (no login required)"** on the login page — full app works without any setup.

---

## 🌐 Adzuna API (Optional — for live job descriptions)

1. Register at [developer.adzuna.com](https://developer.adzuna.com/)
2. Get your `App ID` and `App Key`
3. Add to `backend/.env`:
   ```env
   ADZUNA_APP_ID=your_app_id
   ADZUNA_APP_KEY=your_app_key
   ```

> Without Adzuna keys, the backend uses a comprehensive smart mock JD generator covering 10+ role categories.

---

## 🧠 NLP Pipeline

```
Resume / JD text
      ↓
Text Extraction (pdf-parse / mammoth)
      ↓
Preprocessing (lowercase → remove stopwords → tokenize)
      ↓
Skill Extraction (300+ skill taxonomy, multi-word matching)
      ↓
TF-IDF Vectorization (natural library)
      ↓
Cosine Similarity
      ↓
Match % = 70% skill-based + 30% text similarity
      ↓
Gap Analysis + AI Suggestions
```

---

## 📡 API Reference

### `POST /api/analyze`

Multipart form data:

| Field | Type | Required |
|-------|------|----------|
| `resume` | File (PDF/DOC/DOCX) | ✅ |
| `jd` | File (PDF/DOC/DOCX) | Either jd or jobRole |
| `jobRole` | string | Either jd or jobRole |

**Response:**
```json
{
  "success": true,
  "matchPercentage": 72,
  "matchedSkills": ["react", "typescript", "node.js"],
  "missingSkills": ["docker", "kubernetes"],
  "resumeSkills": ["react", "typescript", "node.js", "python"],
  "jdSkills": ["react", "typescript", "node.js", "docker", "kubernetes"],
  "textSimilarity": 45,
  "suggestions": ["🎯 Focus on acquiring: docker, kubernetes..."],
  "jdSource": "mock",
  "jobRole": "Frontend Developer"
}
```

### `POST /api/analyze/text`

JSON body: `{ resumeText, jdText?, jobRole? }`

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript |
| Auth | Firebase Authentication (Google OAuth) |
| Charts | Recharts (RadialBar, Bar, Pie) |
| File Upload | react-dropzone |
| Backend | Node.js, Express |
| NLP | natural (TF-IDF), pdf-parse, mammoth |
| Job API | Adzuna + smart mock fallback |
| Security | helmet, express-rate-limit, CORS |

---

## 🏃 Production Build

```bash
# Frontend
cd frontend && npm run build
# Output: frontend/dist/

# Backend
cd backend && npm start
```

Set `FRONTEND_URL` in backend `.env` to your deployed frontend URL for CORS.

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Google sign-in popup blocked | Allow popups for localhost, or use Demo Login |
| Firebase errors | Use Demo Login — Firebase is optional |
| PDF shows 0 skills | Ensure PDF is text-based, not scanned image |
| Backend 413 error | File too large — keep files under 5MB |
| CORS errors | Ensure `FRONTEND_URL` in backend `.env` matches your frontend port |