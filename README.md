# ✨ SyncPad – Collaborative Drawing Application

![SyncPad Home Page](./assets/homepage.png)

SyncPad is a real-time, collaborative drawing application built with **Next.js**, **Express**, **TypeScript**, **Tailwind CSS**, and **Turborepo**. It allows multiple users to draw simultaneously on a shared canvas – no third-party APIs used. The canvas sync logic is handcrafted for optimal control and performance.

---

## 📹 Demo

[![Watch the demo](/homepage.png)](https://youtu.be/wNKNHBRvYC8)



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

### 💡 Contributing

```markdown
Contributions are welcome!  
Feel free to fork the repository and submit a pull request 🚀

