# ✨ SyncPad – Collaborative Drawing Application

![SyncPad Home Page](./assets/homepage.png)

SyncPad is a real-time, collaborative drawing application built with **Next.js**, **Express**, **TypeScript**, **Tailwind CSS**, and **Turborepo**. It allows multiple users to draw simultaneously on a shared canvas – no third-party APIs used. The canvas sync logic is handcrafted for optimal control and performance.


## 🧩 This is a **Turborepo monorepo** project containing:
> - A **Next.js frontend** (`apps/web`)
> - An **Express backend** (`apps/http-backend`)
> - A **WebSocket server** (`apps/ws-backend`)
> - A **shared database layer** using Prisma (`packages/db`)

## 🌿 There are two active branches:
> - `dev`: Application development (code, logic, features)
> - `prod`: Production-ready version with **DevOps pipelines** integrated


---

## 📹 Demo

**Watch here:** https://youtu.be/wNKNHBRvYC8


Click the image above to watch a full demo of **SyncPad** – a real-time collaborative drawing application powered by Next.js, Express, Tailwind CSS, and your own custom canvas sync logic.


---

## 🧠 Tech Stack

- **Monorepo with Turborepo**
- **Next.js** – Frontend Framework
- **Express** – Custom Backend
- **TypeScript** – Type Safety
- **Tailwind CSS** – Styling
- **Canvas API** – Custom drawing logic (no external APIs)
- **Prisma + PostgreSQL** – For room/message persistence (optional/future use)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Debjyoti2004/SyncPad.git
cd SyncPad
```

### 2. Install pnpm (if not already installed)
```bash
npm install -g pnpm
```
### 3. Install Dependencies
From the project root:
```bash
pnpm install
```
### 4. ⚙️ Environment Setup
1. Navigate to your project folder
```bash
cd packages/db 
```
2. Create a .env file and add the following:
```bash
DATABASE_URL="your_postgres_url"
```
### 5. 🛠️ Prisma Setup
From the db package
```bash
npx prisma migrate dev --name init
npx prisma generate
```
#### 6. 🧪 Run the App
From the root of the monorepo:
```bash
cd ...
pnpm build
pnpm dev
```

Your application should now be running at *http://localhost:3000.*

## 📌 Features

```markdown
- 🎨 Real-time shared canvas  
- 🧑‍🤝‍🧑 Multi-user collaboration  
- ⚡ Instant synchronization (no lag)  
- 🔐 Built using custom canvas sync logic (no third-party APIs)  
- 🚀 Optimized with Turborepo for fast, scalable monorepo development  

```


---

# ⚙️ From Here, DevOps Takes Over 🚀

The prod branch includes full DevOps support, progressively adding:


1. ✅ CI/CD pipeline with Jenkins  
2. 🐳 Dockerized services (frontend, backend, WebSocket)  
3. 📦 PNPM workspace-aware multi-service build  
4. 🛡️ Security scans (Trivy, OWASP Dependency-Check)  
5. 🔍 Code quality analysis with SonarQube  
6. 🚦 Quality Gate with auto-pipeline enforcement  
7. ☁️ Kubernetes Deployment
8. 🔄 WebSocket message queue (e.g., Redis or BullMQ (in progress))  
9. 📈 Centralized logging + metrics (Prometheus + Grafana)  


