import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import authOptions from '@/libs/auth';
import { uploadImage } from '@/libs/cloudinary';
import Post from '@/model/Post';
import dbConnect from '@/libs/mongoose';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version key
      
    return NextResponse.json({ 
      success: true, 
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('GET Posts Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  let uploadResult = null;
  try {
    const formData = await request.formData();
    
    // Validate required fields
    const requiredFields = ['name', 'features', 'privacy', 'shortDescription'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Handle image upload
    const file = formData.get('image');
    if (!file || file.name === 'undefined') {
      return NextResponse.json(
        { success: false, error: 'Valid image file is required' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    uploadResult = await uploadImage(Buffer.from(buffer));

    // Prepare post data
    const postData = {
      name: formData.get('name'),
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      features: formData.get('features'),
      privacy: formData.get('privacy'),
      playStore_url: formData.get('playStore_url') || null,
      appStore_url: formData.get('appStore_url') || null,
      shortDescription: formData.get('shortDescription'),
    };

    // Create and save post
    const post = await Post.create(postData);
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          ...post.toObject(),
          // Exclude internal fields from response
          __v: undefined
        }
      }, 
      { status: 201 }
    );

  } catch (error) {
    // Cleanup uploaded image if post creation failed
    if (uploadResult?.public_id) {
      try {
        await deleteImage(uploadResult.public_id);
      } catch (cleanupError) {
        console.error('Image cleanup failed:', cleanupError);
      }
    }

    console.error('POST Post Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create post',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    );
  }
}