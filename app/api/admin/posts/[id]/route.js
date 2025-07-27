import authOptions from '@/libs/auth';
import { deleteImage, uploadImage } from '@/libs/cloudinary';
import dbConnect from '@/libs/mongoose';
import Post from '@/model/Post';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const currentPublicId = formData.get('currentPublicId');
    let imageUrl = formData.get('currentImage');
    let publicId = currentPublicId;

    // If new image is uploaded
    if (file && file.name !== 'undefined') {
      // Delete old image if exists
      if (currentPublicId) {
        await deleteImage(currentPublicId).catch(error => {
          console.error('Error deleting old image:', error);
        });
      }

      // Upload new image
      const buffer = await file.arrayBuffer();
      const result = await uploadImage(Buffer.from(buffer));
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const postData = {
      name: formData.get('name'),
      image: imageUrl,
      imagePublicId: publicId,
      features: formData.get('features'),
      privacy: formData.get('privacy'),
      playStore_url: formData.get('playStore_url'),
      appStore_url: formData.get('appStore_url'),
      shortDescription: formData.get('shortDescription'),
    };

    const post = await Post.findByIdAndUpdate(params.id, postData, {
      new: true,
      runValidators: true,
    });
    
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

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary using stored publicId
    if (post.imagePublicId) {
      await deleteImage(post.imagePublicId).catch(error => {
        console.error('Error deleting image:', error);
      });
    }

    // Delete post from database
    await Post.findByIdAndDelete(params.id);
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}