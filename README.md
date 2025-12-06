# 🪐 **KRAZY NOTESY – COSMIC SUPPLY CHAIN FOR SOCIAL CONTENT AUTOMATION**

A next-gen orchestration engine for multi-platform content deployment — engineered as a **proof-of-concept** to validate high-velocity automation, modular architecture, and AI-driven decisioning across the social publishing pipeline.

Krazy Notesy pushes beyond “just scheduling.” It’s a vertically integrated system simulating real-world workflows across ingestion, scheduling, analytics, queueing, and platform management.

---

# 🏅 **Badges That Actually Matter**

<p align="left">
  <img src="https://img.shields.io/badge/Status-Prototype%20V1.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Build-Monorepo-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20Firestore-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/AI-Ready-purple?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" />
</p>

---

# ⚡ **Executive Summary**

Krazy Notesy is a **full-stack social media supply chain prototype** validating:

* event-driven scheduling
* cross-platform publishing logic
* metadata-first media workflows
* analytics visualization
* future-ready AI hooks
* scalable monorepo architecture

Think of it as the MVP of a *ContentOps* automation platform.

---

# 🧠 **Core Feature Portfolio**

| Feature Set                  | Technical Blueprint                                                       | Business Value                                           |
| ---------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Advanced Scheduler**       | Recurrence engine (One-Time, Auto), workflow gating, smart posting delays | Validates orchestration logic for enterprise scheduling  |
| **A/B Analytics Engine**     | Chart.js interactive KPIs + simulated AI scoring                          | Demonstrates insights layer for performance optimization |
| **Media Handling Framework** | Metadata–storage decoupling, Multer ingestion, react-dropzone DnD         | Mimics scalable asset pipelines used by real CMS tools   |
| **Platform Scalability**     | Tracks 9+ social platforms with persistent mock-auth                      | Simulates multi-tenant social integration infrastructure |

---

# 🧩 **Tech Stack Overview**

### **Frontend**

* Next.js (App Router)
* React + Context-based workflow state
* Chart.js for dynamic KPI charts
* react-dropzone for DnD file ingestion
* Tailwind + modular components
* Local Storage for persistent mock platform connections

### **Backend**

* Express.js (Node)
* Multer for file handling
* Firestore (metadata and scheduler persistence)
* Mock analytics service
* REST API architecture for portability

### **DevOps / Deployment**

* Monorepo structure (`client/` + `server/`)
* Vercel frontend hosting
* External Node backend (Ngrok / VPS / Render etc.)
* Cross-origin data fetching via `NEXT_PUBLIC_API_URL`

---

# 🏗 **High-Level Architecture Diagram**

```
                    ┌──────────────────────────────────┐
                    │            Frontend               │
                    │           (Next.js)               │
                    │  - Scheduler UI                   │
                    │  - A/B Analytics UI               │
                    │  - Media Manager                  │
                    │  - Platform Config                │
                    └──────────────┬───────────────────┘
                                   │ REST API Calls
                                   ▼
            ┌──────────────────────────────────────────────────┐
            │                   Backend (Node.js)               │
            │  - Multer File Uploads                           │
            │  - Mock Analytics Engine                          │
            │  - Media Router                                   │
            │  - Job Payload Builder                            │
            └──────────────┬───────────────────────────────────┘
                           │
                           ▼
          ┌───────────────────────────────────────────┐
          │              Firestore Database            │
          │  - Real-time job persistence              │
          │  - Metadata for media                     │
          │  - Scheduler configs                      │
          └───────────────────────────────────────────┘

```

---

# 🚀 **Local Deployment Blueprint**

Two terminals required: **API** + **Client**.

---

## **1️⃣ Clone the Repository**

```bash
git clone https://github.com/iAdityaSharma2912/krazy-notesy.git
cd krazy-notesy
```

---

## **2️⃣ Backend Setup (API Layer)**

```bash
cd server
npm install
mkdir uploads
node server.js
```

Backend runs at: **[http://localhost:5000](http://localhost:5000)**

---

## **3️⃣ Frontend Setup (Next.js)**

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **[http://localhost:3000](http://localhost:3000)**

---

# 🔐 **Access Credentials**

Mock Login:

* **Email:** `test`
* **Password:** `123`

API Health Check:
[http://localhost:5000/api/stats](http://localhost:5000/api/stats)

---

# ☁️ **Vercel Deployment Guidelines**

### Ensure these settings are configured:

#### **Root Directory**

```
client
```

#### **Build Command**

```
npm run build
```

#### **Required Environment Variable**

```
NEXT_PUBLIC_API_URL=<public-node-api-url>
```

Without this, the analytics engine and media manager won’t work.

---

# 🧭 **Future Roadmap – Vision 2.0**

* 🔌 **Real OAuth integrations** (Meta, TikTok, LinkedIn, X, YouTube)
* 🤖 **AI Scoring Engine** analyzing thumbnails, captions, timing
* 🕒 **Distributed Scheduler** using queues (BullMQ / Cloud Tasks)
* ☁️ **Cloud Storage Integration** (S3 / GCS)
* 📊 **Full Analytics Dashboard** with platform-wise KPIs
* 🧬 **Content Intelligence Layer**: hashtags, tone scoring, virality predictions
* 💼 **Team Collaboration Mode** with roles, drafts, and approvals

---

# 👥 **Project Ownership**

* **Developed By:** *Aditya Sharma*
* **Project Type:** Prototype 
* **Current Version:** V1.0
* **Strategic Goal:** Validate scalability for enterprise-grade ContentOps automation

---

