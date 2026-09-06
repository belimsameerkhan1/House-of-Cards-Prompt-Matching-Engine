# IP-SAKTI Sahayak — Frontend Research Workspace

Frontend user interface for **IP-SAKTI Sahayak (Ayurveda IP & Regulatory Guidance)**, built with React, Vite, and Tailwind CSS.

The application implements a full-viewport, 3-column research workspace modeled after professional legal and regulatory intelligence suites.

---

## 🏛️ Layout Architecture

The application occupies the full viewport without long landing page scrolling, optimized for standard desktop viewports (`1366 × 768` and `1440 × 900`):

```
┌─────────────────┬───────────────────────────────────────────┬─────────────────┐
│                 │ TOP HEADER: Context Title | [India] [Intl] [Lang] [AS]      │
│                 ├───────────────────────────────────────────┼─────────────────┤
│                 │                                           │                 │
│  LEFT           │  CENTER RESEARCH WORKSPACE (60–65%)       │  RIGHT CONTEXT  │
│  NAVIGATION     │                                           │  PANEL          │
│  (~240–260px)   │  • Calm Empty State (Initial)             │  (~280–320px)   │
│                 │    or                                     │                 │
│  • Circular S   │  • Active Research Conversation:          │  • Scope & Type │
│  • Research     │    - User Query Bubble                    │  • Formulation  │
│  • History      │    - Progress Stepper                     │    Class        │
│  • Saved        │    - Evidence-First AnswerView            │  • Evidence &   │
│  • Sources      │                                           │    Citations    │
│  • Facilitator  │  ───────────────────────────────────────  │  • Tool Links   │
│  • Settings     │  Suggested Research Action Pills          │    (TKDL, IPO,  │
│                 │  ┌─────────────────────────────────────┐  │    CDSCO, etc.) │
│                 │  │ Thin Fixed Research Composer        │  │                 │
│                 │  │ + Attach                          → │  │                 │
│                 │  └─────────────────────────────────────┘  │                 │
│                 │  Source-Grounded Trust Line               │                 │
└─────────────────┴───────────────────────────────────────────┴─────────────────┘
```

### 1. Left Navigation (`src/components/Sidebar.jsx`)
- Permanent desktop sidebar; slide-out drawer on mobile and tablet.
- Circular **S** emblem with wordmark `IP-SAKTI Sahayak` and subtitle `Ayurveda IP & Regulatory Guidance`.
- Clean navigation items: `Research`, `Research History`, `Saved Guidance`, `Sources Library`, `Find a Facilitator`.
- Subtle sage/green active background (`#E5ECE4`), deep forest text, and Lucide icons.
- Bottom statutory repository badge and `Settings` button.

### 2. Top Header (`src/components/Header.jsx`)
- Left side: Dynamic workspace title (`IP Research Workspace`) with `Compass` icon.
- Right side:
  - `[India] [International]` jurisdiction toggle pill.
  - Keyboard-accessible language dropdown strictly supporting: **English** (default), **हिंदी**, and **मराठी**.
  - **[AS]** Ayurveda Scholar Profile avatar.
  - Mobile trigger button to open the Right Context Panel drawer on small screens.

### 3. Center Workspace (`src/components/ResearchWorkspace.jsx`)
- **Initial State:** Balanced, calm empty state with source-grounded heading:
  - Eyebrow: `SOURCE-GROUNDED GUIDANCE FOR AYURVEDA`
  - Headline: `Protect what you create.`
  - Subheading: `Understand what comes next.`
  - Description: `IP and regulatory research for Ayurveda innovators, researchers, practitioners, and businesses.`
- **Active Research State:** Transforms into an evidence-first research workspace:
  - User Inquiry bubble with file attachment indicators.
  - 4-step retrieval and analysis stepper (`ResearchStatus.jsx`).
  - Structured `AnswerView.jsx`:
    - Short Answer
    - Key Findings & Why this matters (with claim contradiction alerts)
    - Tabbed Jurisdiction Analysis (India vs International)
    - Recommended Next Steps
    - Cited Statutory Entries (`EvidencePanel.jsx`)
    - Confidence Badge and generation signals
    - Statutory Limitations and *"Information, not legal advice"* disclaimer.
- **Suggested Action Pills (`SuggestedActions.jsx`):** Compact row of 6 pills directly above the composer (`Patentability`, `Formulation Classification`, `Trademark`, `GI Protection`, `Prior Art`, `Regulatory Guidance`).
- **Thin Composer (`ResearchComposer.jsx`):** Permanently anchored at bottom-center. Fixed dimensions (`max-w-[672px]`, `h-[98px]`, no expansion). Real textarea, idle character-by-character typing animation, functional `+ Attach` (up to 10MB; PDF/DOC/DOCX/TXT/PNG/JPG/JPEG with inline error and compact removal chip), and `→` submit button (`Enter` = newline, `Ctrl+Enter`/`Cmd+Enter` = submit).
- **Trust Line (`TrustStatement.jsx`):** *Source-grounded research • Authoritative sources • Clear citations • India & International*.

### 4. Right Context Panel (`src/components/ContextPanel.jsx`)
- **Initial Empty State (Zero Fabrication):**
  - Jurisdiction: `India` (or selected)
  - Research Type: `Not selected`
  - Formulation: `Not yet classified` (no pre-selected categories)
  - Evidence: `No research yet` (no fabricated citation counts)
  - Research Tools: Listed as `Capabilities` in standby mode (`Available` indicators for TKDL, Patent databases, Regulatory sources).
- **Post-Submission State:**
  - Dynamically updates with detected formulation category (`Classical`, `Proprietary`, or `New formulation`), ASU textual grounding, live verified citation counts, and registry link statuses (`Connected`, `Indexed`, `Verified`).

---

## 🎨 Design System & Palette

- **Background:** Warm ivory (`#FBF9F5`)
- **Surfaces:** Clean off-white panels (`#FFFFFF`, `#FAF8F3`)
- **Text:** Deep charcoal (`#1C1E21`, `#2D3139`)
- **Primary Accent:** Muted forest green (`#1E3B2B`, `#162E21`)
- **Secondary Accent:** Soft sage (`#E5ECE4`, `#C8D7C7`)
- **Alert Accent:** Restrained terracotta (`#C85A32`, `#FDF3EF`)
- **Typography:** `Poppins` & `Noto Sans Devanagari`
- **Strict Visual Rules:** Zero neon, zero futuristic sci-fi effects, zero casino/card imagery, and zero generic wellness/lifestyle claims.

---

## 📁 Directory Structure

```
frontend/
├── dist/                  # Production build output
├── public/                # Static assets & icons
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AnswerView.jsx
│   │   ├── ClarifyingQuestions.jsx
│   │   ├── ConfidenceBadge.jsx
│   │   ├── ContextPanel.jsx
│   │   ├── EvidencePanel.jsx
│   │   ├── FacilitatorModal.jsx
│   │   ├── Header.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── NavigationDrawer.jsx
│   │   ├── ResearchComposer.jsx
│   │   ├── ResearchStatus.jsx
│   │   ├── ResearchWorkspace.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SuggestedActions.jsx
│   │   └── TrustStatement.jsx
│   ├── pages/             # Dedicated route pages
│   │   ├── Facilitator.jsx
│   │   ├── History.jsx
│   │   ├── SavedGuidance.jsx
│   │   ├── Settings.jsx
│   │   └── Sources.jsx
│   ├── services/          # API & guidance synthesis
│   │   ├── api.js         # FastAPI proxy & fallback handler
│   │   ├── guidanceEngine.js
│   │   └── knowledgeBaseData.js
│   ├── utils/
│   │   └── translations.js # Trilingual strings (en, hi, mr)
│   ├── App.jsx            # Top-level workspace container
│   ├── index.css          # Design tokens & typography
│   └── main.jsx           # React DOM root
├── index.html             # HTML entry point
├── package.json           # Scripts & dependencies
├── postcss.config.js      # PostCSS config
├── tailwind.config.js     # Tailwind color tokens & typography
└── vite.config.js         # Vite configuration with API proxy
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Python 3.10+ (for running the backend API in the parent directory)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173/`.

### 3. Backend Integration & API Proxy
The Vite development server is configured in `vite.config.js` to automatically proxy `/api` requests to the FastAPI backend running on port `8000`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
}
```

Connected FastAPI endpoints:
- `POST /api/query-knowledge` — RAG retrieval over curated Ayurveda statutory entries
- `POST /api/classify-product` — Regulatory product classification agent
- `GET /health` — Backend health status

*Note: If the backend is offline, the frontend gracefully falls back to client-side rule evaluation and knowledge base search without breaking the UI.*

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets in `frontend/dist/`.

### 5. Preview Production Build
```bash
npm run preview
```
