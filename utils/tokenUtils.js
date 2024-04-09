// tokenUtils.js
import jwt from 'jsonwebtoken';

function generateToken(payload, secretKey, expiresIn) {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

export { generateToken };
