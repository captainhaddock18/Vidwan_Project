# Aham Brahmasmi Foundation Scheduler (Sharada Peetham)

A production-ready MERN stack web application built specifically for the administrators of the **Aham Brahmasmi Foundation / Sharada Peetham** to coordinate spiritual camp schedules, allocate scholars (Vidwans), and instantly detect scheduling conflicts without spreadsheets or endless phone calls.

The interface is built using a calm, traditional-yet-modern design language (Cream background, Sandalwood card panels, and Saffron accents) with large buttons and highly legible text designed for tablet and desktop ease-of-use.

---

## Technical Stack
* **Database**: MongoDB (Mongoose schemas)
* **Backend**: Node.js & Express.js with JWT Security & custom role middleware
* **Frontend**: React.js (Vite compiler) with Tailwind CSS v4 & FullCalendar.js
* **Icons**: Lucide-React
* **HTTP Client**: Axios

---

## Directory Structure
```
vidwan-scheduler/
├── backend/
│   ├── src/
│   │   ├── config/      # DB connection
│   │   ├── middleware/  # Auth & role access guards
│   │   ├── models/      # Mongoose schemas (User, Vidwan, Program)
│   │   ├── routes/      # Controller endpoints (auth, vidwans, programs)
│   │   └── server.js    # Entry point
│   ├── .env             # Backend variables (MongoDB URI, JWT secret)
│   ├── package.json
│   └── seed.js          # Database populator
├── frontend/
│   ├── src/
│   │   ├── components/  # Sidebar, ConflictWarning
│   │   ├── context/     # AuthState context
│   │   ├── pages/       # Login, Dashboard, Vidwans, Programs, Availability
│   │   ├── utils/       # Axios API config
│   │   ├── App.jsx      # Router & ProtectedLayout
│   │   ├── index.css    # Tailwind v4 directives & Calendar overrides
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js   # Vite + Tailwind compiler configs
└── README.md
```

---

## Prerequisites
Ensure the following are installed:
* **Node.js** (v18 or higher recommended)
* **MongoDB** (local service or MongoDB Atlas cloud cluster)

---

## Configuration & Setup

### 1. Database & Environment Setup
Open the backend environment file [backend/.env](file:///c:/Users/thara/Documents/Arduino/Vidwan%20Project/backend/.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vidwan-scheduler
JWT_SECRET=aham_brahmasmi_shastri_peetham_secret_987654321
```
*If using MongoDB Atlas or custom ports, replace the `MONGODB_URI` connection string.*

### 2. Backend Installation & Seeding
In your terminal, navigate to the `backend` folder:
```bash
cd backend
npm install
```

To pre-populate users, Vidwan scholars, and sample programs:
```bash
npm run seed
```
*(Ensure your MongoDB service is running before executing this command).*

### 3. Start Backend Server
```bash
npm run dev
```
The API server will launch at `http://localhost:5000`.

### 4. Frontend Installation & Start
Open a second terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install --legacy-peer-deps
```
*Note: `--legacy-peer-deps` is used to bypass peer dependency warnings between React 19 and third-party widgets like FullCalendar.*

To start the Vite developer client:
```bash
npm run dev
```
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

---

## System Accounts (Seed Credentials)
Log in with either of the following pre-configured credentials:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin` | `password123` |
| **Program Director** | `director` | `password123` |

---

## Core Features Walkthrough

### 1. Real-Time Overlap Detection (Conflict Warning)
When creating or editing a program in the **Manage Programs** page or inline in the **Calendar Dashboard**, selecting a date range and scholar triggers a background check against active commitments. If the scholar is already booked:
* A warm amber alert block lists the overlapping program name, dates, city, and venue.
* Scheduling is allowed, but the system clearly logs the alert, and conflict boundaries are marked in the calendar.

### 2. Scholar Availability & "Free Weekends" Finder
In the **Availability Search** page, selecting a Vidwan:
* Loads a dedicated calendar showing all their schedules.
* Computes and displays **Upcoming Free Weekends** over the next 60 days, filtering out any Saturday/Sunday overlaps. This allows program directors to instantly coordinate weekend discourse events.

### 3. Integrated Calendar View
The **Dashboard** features FullCalendar with month and week views.
* Camps are color-coded: **Confirmed** (Forest Green), **Tentative** (Gold/Yellow), **Completed** (Slate Gray), and **Cancelled** (Light Red with strikethroughs).
* Filters let you view camps by a specific Vidwan, City, Language, or status.
* Clicking any event opens a detailed drawer allowing administrators with scheduling privileges to edit the camp configuration inline.
