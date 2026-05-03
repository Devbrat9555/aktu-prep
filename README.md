# 🎓 AKTU Prep

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)

**AKTU Prep** is the ultimate digital repository for AKTU students. It provides a high-performance, unit-wise organized collection of 9GB+ study materials, curated video lectures, and expert-verified solutions for B.Tech, MBA, and B.Pharma.

[Live Demo](https://aktu-prep.onrender.com) • [Report Bug](https://github.com/Devbrat9555/aktu-prep/issues) • [Request Feature](https://github.com/Devbrat9555/aktu-prep/issues)

---

## 🌟 Vision
To empower technical university students with a distraction-free, premium learning environment where every resource is just two clicks away.

## 🚀 Key Features
- **📚 9GB+ Unit-Wise Repository**: Structured notes for every unit of the AKTU syllabus.
- **🎥 Curated Video Hub**: One-shot and detailed lectures from top-tier educators.
- **📝 PYQ Engine**: 10+ years of Previous Year Papers with unit-level sorting.
- **⚡ Smart Search**: Instant lookup for subjects, topics, or specific unit numbers.
- **🛡️ Admin Dashboard**: Real-time content management (Add/Delete/Sync).
- **📱 PWA Ready**: Install as a native app on mobile and desktop.

## 🛠️ Advanced Tech Stack

### Frontend
- **Framework**: React.js (TypeScript)
- **Styling**: Tailwind CSS & Glassmorphism UI
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Auth**: Clerk Professional Authentication
- **File Management**: Optimized Multer Streaming

### Deployment
- **Platform**: Render (Automated CI/CD)
- **Domain**: Cloudflare Protected

---

## 📂 Project Architecture
```text
AKTU-Prep/
├── public/                # Static assets & Optimized PDFs
├── server/                # Production Backend Engine
│   ├── controllers/       # Business logic & Payload handling
│   ├── models/            # Mongoose Schemas (Subject, Material, Paper)
│   ├── routes/            # RESTful API Endpoints
│   └── index.js           # Entry Point
├── src/                   # High-Performance Frontend
│   ├── components/        # Atomic UI Components
│   ├── context/           # Global State (Auth, Theme)
│   ├── pages/             # Dynamic Route Views
│   └── services/          # Axios API Interceptors
```

## 🛠️ Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Devbrat9555/aktu-prep.git
   npm install && cd server && npm install
   ```
2. **Environment Variables**:
   Create `.env` in the `server` root:
   ```env
   MONGODB_URI=your_cluster_url
   PORT=5000
   ```
3. **Launch**:
   ```bash
   npm run dev  # Frontend
   npm start    # Backend
   ```

## 🤝 Contributing
Contributions make the community amazing! 
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---
**Maintained by [Devbrat Yadav](https://github.com/Devbrat9555)**
