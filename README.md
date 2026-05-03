# AKTU Prep

A comprehensive study companion for AKTU (Dr. A.P.J. Abdul Kalam Technical University) students, providing organized notes, video lectures, and previous year question papers.

![AKTU Prep Logo](/public/logo.png)

## 🚀 About The Project
AKTU Prep is designed to simplify the academic journey for technical university students. It organizes vast amounts of study material (9GB+) into a navigable, unit-wise repository for every subject across all semesters.

## ✨ Key Features
- **Unit-Wise Notes**: Access structured PDF notes for every unit of your syllabus.
- **Video Lectures**: Curated one-shot and detailed video lectures from top educators.
- **Previous Year Papers**: Practice with actual university exam papers organized by year.
- **Smart Search**: Quickly find any subject, topic, or specific unit.
- **Admin Controls**: Dedicated dashboard for adding/deleting content in real-time.
- **Mobile Friendly**: Fully responsive design for studying on the go.
- **PWA Support**: Install it on your device for a native app experience.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Clerk / Auth Custom
- **Icons**: Phosphor Icons
- **Deployment**: Render

## 📁 Project Structure
```text
AKTU-Prep/
├── public/                # Static assets (PDFs, Images, Sounds)
├── server/                # Node.js Backend
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   └── index.js           # Server entry point
├── src/                   # React Frontend
│   ├── components/        # UI Components
│   ├── context/           # State management
│   ├── pages/             # App views
│   └── services/          # API integration
```

## 🛠️ Getting Started
1. **Clone the repo**:
   ```bash
   git clone https://github.com/Devbrat9555/aktu-prep.git
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```
3. **Environment Setup**:
   Create a `.env` in the `server` folder with:
   ```text
   MONGODB_URI=your_mongodb_url
   PORT=5000
   ```
4. **Run Locally**:
   ```bash
   # Root directory
   npm run dev
   # Server directory
   npm start
   ```

## 📜 License
Distributed under the MIT License.

---
**Made with ❤️ for AKTU Students**
