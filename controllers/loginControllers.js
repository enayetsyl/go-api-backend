import { comparePassword } from "../utils/comparePassword.js";
import { generateToken } from "../utils/tokenUtils.js";
import { findUserByEmail } from "../services/findUserByEmail.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ userId: user._id.toString() }, process.env.JWT_SECRET, "1d");


    res.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
}
