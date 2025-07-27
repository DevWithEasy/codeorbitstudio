import dbConnect from '@/libs/mongoose';
import Post from '@/model/Post';
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
  await dbConnect();
  try {
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}