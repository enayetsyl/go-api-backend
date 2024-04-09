import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB connection URI
const uri = "mongodb+srv://balpreet:ct8bCW7LDccrGAmQ@cluster0.2pwq0w2.mongodb.net/tradingdb";

// Connect to MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// Middleware to verify token
function authenticateToken(req, res, next) {
  // Get token from cookies
  const token = req.cookies.token;

  // If token not found, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: "Forbidden" });
  }
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // COLLECTIONS
    const db = client.db();
  const usersCollection = db.collection('users');

  // Protected route
app.get("/api/auth/protected", authenticateToken, (req, res) => {
  // If token is verified, return success response
  res.status(200).json({ message: "Access granted" });
});

 // Signup route
 app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;


    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await usersCollection.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: "User already exists." });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword
    });

    const userId = result.insertedId.toString()

    // Generate token
    const token = jwt.sign({ userId: result.insertedId.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // Set token in cookies
    res.cookie('token', token, { 
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true,
      sameSite: "strict",
       secure: true // Enable this if your app is served over HTTPS
    });

    // Return success response
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId.toString() });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database by email
    const user = await usersCollection.findOne({ email });


    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is not valid, return error
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // Set token in cookies
    res.cookie('token', token, { 
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: true // Enable this if your app is served over HTTPS
    });

    // Return success response
    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
});








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

  
  run().catch(console.dir);
  

// Start the server
app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));