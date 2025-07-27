import dbConnect from '@/libs/mongoose';
import Post from '@/model/Post';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}