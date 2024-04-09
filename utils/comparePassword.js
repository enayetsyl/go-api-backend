// passwordUtils.js
import bcrypt from 'bcrypt';

async function comparePassword(password, hashedPassword) {
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

export { comparePassword };
