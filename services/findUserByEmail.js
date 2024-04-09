import { connectDB } from "./dbServices.js";



async function findUserByEmail(email) {
  const db = await connectDB();
  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export { findUserByEmail };
