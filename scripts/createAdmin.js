import dbConnect from '../lib/mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  await dbConnect();
  
  const email = 'admin@codeorbitstudio.com';
  const password = 'admin123';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    await User.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();