# 🏥 Hospital Management System

---

## 📌 Project Title

**Hospital Management System** — A full-stack web application for managing hospital operations including patient appointments, doctor availability, lab requests, feedback, cleaning tasks, supply requests, and AI-powered features.

---

## 🚨 Problem Description

Healthcare facilities face enormous operational challenges:

- **Fragmented workflows** — receptionists, doctors, lab technicians, and cleaning staff use disconnected systems or manual processes.
- **Appointment mismanagement** — no centralized way for patients to book, reschedule, or cancel appointments.
- **Lack of transparency** — patients cannot track lab results, view doctor ratings, or leave structured feedback.
- **Manual admin overhead** — admin staff must manually manage user approvals, appointments, and feedback moderation.
- **Communication gaps** — no real-time coordination between staff roles.

---

## 💡 Proposed Solution

A role-based, full-stack hospital management platform that:

- Provides **dedicated dashboards** for each user role: Patient, Doctor, Receptionist, Lab Technician, Cleaning Staff, and Admin.
- Centralizes **appointment booking** with real-time doctor availability.
- Automates **lab request workflows** with file uploads for test results.
- Enables **feedback and rating** collection per appointment.
- Supports **AI-powered chatbot** assistance and **skin image analysis**.
- Gives **admin full control** over user approvals, system data, and moderation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Role-Based Auth | JWT authentication with 6 roles: admin, patient, doctor, receptionist, labTechnician, cleaningStaff |
| 👤 User Approval Flow | Staff registrations require admin approval before login is allowed |
| 📅 Appointment Booking | Patients and receptionists can book; doctors can update status |
| 🕐 Doctor Availability | Doctors set their available time slots; patients book from them |
| 🧪 Lab Requests | Doctors raise requests; lab technicians accept and upload results |
| ⭐ Feedback & Ratings | Patients rate completed appointments; doctor averages are calculated |
| 🧹 Cleaning Task Manager | Receptionists assign tasks to cleaning staff who can mark them complete |
| 📦 Supply Requests | Cleaning staff request supplies; admin approves or rejects |
| 🤖 AI Chatbot | Integrated Groq/OpenAI chatbot for health tips and queries |
| 🖼️ Skin Image Analyzer | AI-powered skin condition analysis via image upload |
| 🛠️ Admin Panel | Full CRUD for users, appointments, feedback, and pending approvals |

---

## 🛠️ Technologies Used

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database and ODM
- **bcryptjs** — Password hashing
- **jsonwebtoken (JWT)** — Authentication tokens
- **Cloudinary** — Image and file storage (lab results, skin images)
- **Multer** — File upload middleware
- **Groq / OpenAI API** — AI chatbot integration

### Frontend
- **React.js** + **Vite** — UI framework and build tool
- **React Router** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS** — Styling

---

## 📡 API Endpoints (with Examples)

> **Base URL:** `http://localhost:5000/api`
> 
> **Auth Header:** `Authorization: Bearer <token>` (required on protected routes)

---

### 🔐 Auth Routes — `/api/auth`

#### POST `/api/auth/register`
Register a new user account.

**Body:**
```json
{
  "name": "Dr. John Silva",
  "email": "john@hospital.com",
  "password": "Password@123",
  "role": "doctor"
}
```

**Response (201):**
```json
{
  "message": "Registration successful. Please wait for admin approval.",
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "Dr. John Silva",
  "email": "john@hospital.com",
  "role": "doctor",
  "status": "pending"
}
```

---

#### POST `/api/auth/login`
Login and receive a JWT token.

**Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "Admin@1234"
}
```

**Response (200):**
```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "role": "admin",
  "status": "approved",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

---

### 👥 User Routes — `/api/users`

#### GET `/api/users/profile`
Get the logged-in user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "_id": "664a1b2c...",
  "name": "Jane Patient",
  "email": "jane@email.com",
  "role": "patient",
  "status": "approved"
}
```

---

#### PUT `/api/users/profile`
Update profile information.

**Body:**
```json
{
  "name": "Jane Updated",
  "email": "jane_new@email.com"
}
```

---

#### DELETE `/api/users/profile`
Delete user's own account.

---

#### GET `/api/users/patients`
Get all patients *(receptionist / admin / doctor only)*.

---

#### POST `/api/users/patients`
Create a new patient *(receptionist only)*.

**Body:**
```json
{
  "name": "New Patient",
  "email": "newpatient@email.com",
  "password": "Pass@123",
  "role": "patient"
}
```

---

### 📅 Appointment Routes — `/api/appointments`

#### POST `/api/appointments`
Book an appointment *(patient only)*.

**Body:**
```json
{
  "doctor": "664a1b2c3d4e5f6a7b8c9d11",
  "date": "2025-06-15T10:00:00Z"
}
```

**Response (201):**
```json
{
  "_id": "664a...",
  "patient": "664a...",
  "doctor": "664a...",
  "date": "2025-06-15T10:00:00.000Z",
  "status": "scheduled"
}
```

---

#### GET `/api/appointments/patient`
Get all appointments for the logged-in patient.

---

#### GET `/api/appointments/doctor`
Get all appointments for the logged-in doctor.

---

#### GET `/api/appointments/all`
Get all appointments *(receptionist / admin only)*.

---

#### PUT `/api/appointments/:id`
Update appointment status *(doctor only)*.

**Body:**
```json
{
  "status": "completed"
}
```

---

#### PUT `/api/appointments/:id/cancel`
Cancel an appointment *(patient only)*.

---

#### PUT `/api/appointments/:id/reschedule`
Reschedule an appointment *(patient only)*.

**Body:**
```json
{
  "date": "2025-06-20T14:00:00Z"
}
```

---

#### GET `/api/appointments/doctors`
Get all doctors with their average ratings.

---

### 🕐 Availability Routes — `/api/availability`

#### POST `/api/availability`
Add a time slot *(doctor only)*.

**Body:**
```json
{
  "date": "2025-06-15",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

---

#### GET `/api/availability`
Get own availability slots *(doctor only)*.

---

#### DELETE `/api/availability/:id`
Delete a time slot *(doctor only)*.

---

#### GET `/api/availability/doctor/:doctorId`
Get available slots for a specific doctor *(any logged-in user)*.

---

### 🧪 Lab Request Routes — `/api/lab-requests`

#### POST `/api/lab-requests`
Create a lab request *(doctor only)*.

**Body:**
```json
{
  "patient": "664a1b2c3d4e5f6a7b8c9d22",
  "testType": "Blood Test",
  "description": "Check full blood count"
}
```

---

#### GET `/api/lab-requests/doctor`
Get all lab requests created by the doctor.

---

#### GET `/api/lab-requests/lab`
Get all pending lab requests *(lab technician only)*.

---

#### PUT `/api/lab-requests/:id/accept`
Accept a lab request *(lab technician only)*.

---

#### PUT `/api/lab-requests/:id/complete`
Complete a lab request with result file upload *(lab technician only)*.

**Content-Type:** `multipart/form-data`

**Form fields:**
- `resultFile` — (file) the lab result image or PDF
- `resultText` — (string) optional notes

---

#### GET `/api/lab-requests/patient`
Get lab results for the logged-in patient.

---

#### DELETE `/api/lab-requests/:id`
Delete a lab request *(doctor or lab technician)*.

---

### ⭐ Feedback Routes — `/api/feedback`

#### POST `/api/feedback`
Submit feedback for a completed appointment *(patient only)*.

**Body:**
```json
{
  "appointment": "664a1b2c3d4e5f6a7b8c9d33",
  "rating": 5,
  "comment": "Excellent consultation, very thorough."
}
```

---

#### PUT `/api/feedback/:id`
Update existing feedback *(patient only)*.

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment."
}
```

---

#### GET `/api/feedback/doctor`
Get all feedback for the logged-in doctor.

---

#### GET `/api/feedback/patient`
Get all feedback submitted by the logged-in patient.

---

### 🧹 Cleaning Task Routes — `/api/cleaning-tasks`

#### POST `/api/cleaning-tasks`
Create a cleaning task *(admin / receptionist only)*.

**Body:**
```json
{
  "assignedTo": "664a1b2c3d4e5f6a7b8c9d44",
  "description": "Clean Ward 3 bathrooms",
  "location": "Ward 3"
}
```

---

#### GET `/api/cleaning-tasks`
Get all cleaning tasks *(admin / receptionist only)*.

---

#### GET `/api/cleaning-tasks/my`
Get tasks assigned to the logged-in cleaning staff member.

---

#### PUT `/api/cleaning-tasks/:id/complete`
Mark a task as complete *(cleaning staff only)*.

---

#### PUT `/api/cleaning-tasks/:id`
Update a task *(admin / receptionist only)*.

---

#### DELETE `/api/cleaning-tasks/:id`
Delete a task *(admin / receptionist only)*.

---

### 📦 Supply Request Routes — `/api/supply-requests`

#### POST `/api/supply-requests`
Create a supply request *(cleaning staff only)*.

**Body:**
```json
{
  "item": "Mop and bucket",
  "quantity": 2,
  "reason": "Broken equipment replacement"
}
```

---

#### GET `/api/supply-requests/my`
View own supply requests *(cleaning staff only)*.

---

#### GET `/api/supply-requests`
View all supply requests *(admin only)*.

---

#### PUT `/api/supply-requests/:id`
Approve or reject a supply request *(admin only)*.

**Body:**
```json
{
  "status": "approved"
}
```

---

### 🛠️ Admin Routes — `/api/admin`

> All routes require `admin` role.

#### GET `/api/admin/users`
Get all registered users.

#### POST `/api/admin/users`
Create a new user manually.

#### PUT `/api/admin/users/:id`
Update any user's data.

#### DELETE `/api/admin/users/:id`
Delete any user.

#### GET `/api/admin/pending-users`
Get all users with `pending` approval status.

#### PUT `/api/admin/approve-user/:id`
Approve a pending user.

**Response:**
```json
{ "message": "User approved successfully" }
```

#### PUT `/api/admin/reject-user/:id`
Reject a pending user.

#### GET `/api/admin/appointments`
Get all appointments in the system.

#### DELETE `/api/admin/appointments/:id`
Delete any appointment.

#### GET `/api/admin/feedback`
Get all feedback entries.

#### DELETE `/api/admin/feedback/:id`
Delete any feedback entry.

---

## ⚙️ Setup Instructions

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) v18 or above
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or a MongoDB Atlas account
- [Git](https://git-scm.com/)
- A [Cloudinary](https://cloudinary.com/) account (free tier is enough)
- *(Optional)* A [Groq](https://console.groq.com) API key for the AI chatbot

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hospital-management-system.git
cd "hospital management system"
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with the following:

```env
MONGO_URI=mongodb://localhost:27017/hospital_db
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

SUPER_ADMIN_EMAIL=admin@gmail.com
SUPER_ADMIN_PASSWORD=Admin@1234

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ▶️ How to Run the Project

### Start MongoDB (if running locally)

```bash
mongod
```

Or use MongoDB Compass / Atlas — update `MONGO_URI` in your `.env` accordingly.

---

### Start the Backend Server

```bash
cd backend
npm start
```

> Server will run at: `http://localhost:5000`

---

### Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```

> Frontend will run at: `http://localhost:5173`

---

### Default Admin Login

| Field | Value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `Admin@1234` |

> The super admin account is created automatically on first run using the `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from `.env`.

---

### Testing with Postman

1. Open **Postman**.
2. Import or manually create requests using the base URL `http://localhost:5000/api`.
3. First call `POST /api/auth/login` with admin credentials to get a **JWT token**.
4. Copy the token and add it as a **Bearer Token** in the Authorization tab for all protected routes.
5. Use the endpoint examples above to test each feature (GET, POST, PUT, DELETE).

---

## 📁 Project Structure

```
hospital management system/
├── backend/
│   ├── config/         # DB and Cloudinary config
│   ├── controllers/    # Business logic for each feature
│   ├── middleware/     # Auth and file upload middleware
│   ├── models/         # Mongoose schemas (User, Appointment, etc.)
│   ├── routes/         # Express route definitions
│   ├── utils/          # Token generation, Cloudinary helpers
│   ├── uploads/        # Local upload storage
│   ├── server.js       # App entry point
│   └── .env            # Environment variables
└── frontend/
    ├── src/
    │   ├── api/        # Axios instance config
    │   ├── components/ # Shared UI components
    │   ├── contexts/   # Auth and Language context
    │   ├── pages/      # Role-based page views
    │   └── App.jsx     # Root component
    └── index.html
```

---

*Built with ❤️ for efficient hospital operations.*
