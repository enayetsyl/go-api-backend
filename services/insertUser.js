import { connectDB } from "./dbServices.js";

export async function insertUser(email, hashedPassword) {
  const db = await connectDB();

  try {
    const usersCollection = db.collection("users");
    const result = await usersCollection.insertOne({ email, password: hashedPassword });
    return result.insertedId;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}
