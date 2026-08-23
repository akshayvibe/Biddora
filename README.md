<div align="center">
  <img src="https://raw.githubusercontent.com/akshayvibe/Biddora/main/docs/home.png" alt="Biddora Home" width="800" />
  <h1>Biddora ⚡️</h1>
  <p><strong>A Real-Time, Full-Stack Auction Platform featuring a bold Neo-Brutalist UI</strong></p>
</div>

---

## 📖 Overview

**Biddora** is a comprehensive, production-ready full-stack online auction marketplace. It brings together a beautiful, custom **React frontend** with a robust, highly-concurrent **Spring Boot backend**.

Whether it's vintage electronics or modern art, Biddora allows users to browse active auctions, track time remaining, and engage in **real-time live bidding** powered by WebSockets. The price updates instantly for all connected clients without page reloads.

### ✨ Key Features

- **Live Real-Time Bidding:** Powered by Spring WebSockets and STOMP, bids update instantly across all connected browsers.
- **Bold Neo-Brutalist UI:** A stunning, custom-built React frontend using raw CSS tokens, distinct drop shadows, and sharp borders.
- **Secure Authentication:** Full JWT-based login, registration, and role-based access control (RBAC).
- **Automated Auction Resolution:** Scheduled tasks automatically determine and record auction winners when the clock runs out.
- **User Profiles:** Users can list items, track their won auctions, and manage favorites and reviews.
- **High Performance:** Designed to handle concurrent bids with data consistency checks and optimized PostgreSQL queries.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **React 18** (Vite)
- **Vanilla CSS** (Custom Neo-Brutalist Design System)
- **React Router** for navigation
- **StompJS / SockJS** for WebSocket connections

### Backend (Server)
- **Java 17** & **Spring Boot 3**
- **Spring Security** (JWT Auth)
- **Spring WebSocket** (Live messaging)
- **Spring Data JPA** (Hibernate)

### Database & Infrastructure
- **PostgreSQL** (Relational Data)
- **Docker & Docker Compose** (Containerization)
- **Maven** (Build Tool)

---

## 📸 Interface Previews

| The Marketplace | Secure Authentication |
|:---:|:---:|
| <img src="docs/home.png" width="400" alt="Home page"> | <img src="docs/login.png" width="400" alt="Login page"> |

*(Note: Biddora features a completely custom CSS framework focusing on contrast, legibility, and physical button presses.)*

---

## 🚀 Running Locally

Biddora is neatly organized into two directories: `/backend` and `/frontend`.

### 1. Start the Database
The backend relies on PostgreSQL. A convenient `docker-compose.yml` is provided in the root directory.
```bash
docker-compose up -d
```

### 2. Start the Backend
Navigate to the backend directory and run the Spring Boot application using the Maven wrapper.
```bash
cd backend
./mvnw spring-boot:run
```
*The backend API will run on `http://localhost:8080`.*

### 3. Start the Frontend
In a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server.
```bash
cd frontend
npm install
npm run dev
```
*The UI will run on `http://localhost:5173`.*

---

## 🌍 How to Deploy (Make it Live!)

If you want to put Biddora on the internet for your recruiter to see, here is the easiest approach using modern hosting providers:

### Step 1: Prepare the Database
You need a managed PostgreSQL database. 
- **Recommendation:** Use [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) (both have great free tiers).
- Update your backend `application.yml` (or environment variables) with the connection string they provide you.

### Step 2: Deploy the Backend (Render or Railway)
Because the backend uses WebSockets and Spring Boot, [Render.com](https://render.com/) or [Railway.app](https://railway.app/) are perfect.
1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the Java Maven project in the `backend/` folder.
3. Set your environment variables (e.g., `JWT_SECRET`, `SPRING_DATASOURCE_URL`).
4. Click Deploy! You will get a live URL (e.g., `https://biddora-backend.up.railway.app`).

### Step 3: Deploy the Frontend (Vercel)
[Vercel](https://vercel.com/) is the easiest place to host a Vite/React frontend.
1. In `frontend/src/services/api.js`, change `http://localhost:8080/api` to your new live backend URL (e.g., `https://biddora-backend.up.railway.app/api`).
2. Push this change to GitHub.
3. Connect your GitHub repo to Vercel.
4. Set the Root Directory to `frontend`.
5. Click Deploy!

Your app is now live and accessible to anyone in the world! 

---

## 🤝 Author
Built by **Akshay Kumar Mishra** & **Mirza Felić**.
