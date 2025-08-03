# 📹 vKYC App – Video KYC Verification Platform

A secure, scalable video-based KYC (Know Your Customer) onboarding platform built with the **MERN stack**, **LiveKit**, **Socket.io**, and modern frontend tools like **Vite** and **Tailwind CSS**.

---

## 🚀 Features

- 👥 **User/Admin Authentication**
- 🔐 **JWT-secured login**
- 📁 **Document Upload** (Aadhaar, PAN, etc.)
- 🎥 **Real-time Video KYC** via **LiveKit**
- 📞 **Join Request System** using **Socket.io**
- 👨‍💼 **Admin Dashboard** with request approvals
- 📂 **Cloudinary Integration** for media storage
- 🌐 **Vite** frontend with **Tailwind CSS** and modern UI

---

## 🧱 Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Axios
- Socket.io-client
- LiveKit React Components

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for auth
- Socket.io (server)
- Cloudinary for uploads

---

## 📁 Project Structure
vkyc-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   └── index.html
├── .env
├── docker-compose.yml
└── README.md


---

## ⚙️ Setup Instructions


### 1. Clone the repository

```bash
git clone https://github.com/Arnab224/vkyc-app.git
cd vkyc-app


### 2. Install dependencies

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install