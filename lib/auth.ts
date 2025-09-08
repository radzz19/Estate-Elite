import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = 'admin123'; // You can change this password
const JWT_SECRET = 'your-jwt-secret-key'; // Change this to a secure random string

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // For simplicity, we're using a plain password comparison
  // In production, you should hash the password
  return password === ADMIN_PASSWORD;
}

export function generateToken(isAdmin: boolean): string {
  return jwt.sign({ isAdmin }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { isAdmin: boolean } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
    return decoded;
  } catch {
    return null;
  }
}
