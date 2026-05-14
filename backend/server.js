require("dotenv").config(); // MUST be first

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Initialize Cloudinary
require('./config/cloudinary');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skinImageRoutes = require('./routes/skinImageRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const labRequestRoutes = require('./routes/labRequestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cleaningTaskRoutes = require('./routes/cleaningTaskRoutes');
const supplyRequestRoutes = require('./routes/supplyRequestRoutes');
const chatRoutes = require('./routes/chatRoutes');
const patientRoutes = require('./routes/patientRoutes'); // ✅ NEW

const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
let superAdminSeeded = false;
let dbCheckInProgress = false;

// ===============================
// CORS (MUST BE FIRST)
// ===============================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===============================
// Middleware
// ===============================
app.use(express.json());

// ===============================
// Seed Super Admin
// ===============================
const seedSuperAdmin = async () => {
  if (superAdminSeeded) {
    return;
  }

  try {
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@gmail.com';
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Admin@1234';

    const exists = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (!exists) {
      await User.create({
        name: 'Super Admin',
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        role: 'admin',
        status: 'approved'
      });

      console.log('Super admin created');
    } else {
      exists.name = 'Super Admin';
      exists.password = SUPER_ADMIN_PASSWORD;
      exists.role = 'admin';
      exists.status = 'approved';
      await exists.save();

      console.log('Super admin already exists; credentials updated from .env');
    }

    superAdminSeeded = true;
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
};

const ensureDatabase = async () => {
  if (dbCheckInProgress) {
    return;
  }

  dbCheckInProgress = true;

  try {
    const connected = await connectDB();

    if (connected) {
      await seedSuperAdmin();
    }
  } finally {
    dbCheckInProgress = false;
  }
};

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Check MongoDB Atlas Network Access and your MONGO_URI.'
    });
  }

  next();
};

// ===============================
// Routes
// ===============================

// Root route
app.get("/", (req, res) => {
  res.send("Hospital Management Backend Running...");
});

// API test route
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/api/health", (req, res) => {
  res.json({
    api: "running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Main APIs
app.use('/api', requireDatabase);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skin-images', skinImageRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/lab-requests', labRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cleaning-tasks', cleaningTaskRoutes);
app.use('/api/supply-requests', supplyRequestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/patient', patientRoutes); // ✅ NEW

// ===============================
// Server Start
// ===============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  ensureDatabase();
  setInterval(ensureDatabase, 15000);
};

startServer();
