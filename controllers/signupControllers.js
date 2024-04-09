import { hashPassword } from "../utils/passwordUtils.js";
import { insertUser } from "../services/insertUser.js";
import { findUserByEmail } from "../services/findUserByEmail.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

// Check if user already exists
const existingUser = await findUserByEmail(email);
if (existingUser) {
  return res.status(400).json({ message: "User already exists." });
}


    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const user = await insertUser(email, hashedPassword);

     // Generate token
     const token = jwt.sign({ userId: user.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // Set token in cookies
    res.cookie('token', token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: true // Enable this if your app is served over HTTPS
    });

    res.status(201).json({ message: "User registered successfully", userId: user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "An error occurred while registering the user" });
  }
}
