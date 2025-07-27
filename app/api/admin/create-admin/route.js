import dbConnect from '@/libs/mongoose';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// Track if admin has been created
let adminCreated = false;

export async function GET() {
  try {
    if (adminCreated) {
      return NextResponse.json(
        { success: false, error: 'Admin can only be created once' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if admin already exists in database
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      adminCreated = true;
      return NextResponse.json(
        { success: false, error: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    await User.create({
      email: 'admin@codeorbitstudio.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    adminCreated = true;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully',
        credentials: {
          email: 'admin@codeorbitstudio.com',
          password: 'admin123'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}