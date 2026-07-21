const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ==========================================
// REGISTER ADMIN
// Sirf first admin create karne ke liye
// ==========================================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Password ko hash karo
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // MongoDB me hashed password save hoga
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(
      "Admin Registration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create admin",
      error: error.message,
    });
  }
};


// ==========================================
// ADMIN LOGIN
// ==========================================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // MongoDB me admin find karo
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Entered password ko hashed password se compare karo
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT token create karo
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


module.exports = {
  registerAdmin,
  adminLogin,
};