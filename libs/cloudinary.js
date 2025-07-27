import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function uploadImage(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'codeorbitstudio',
      resource_type: 'auto'
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
}

export async function deleteImage(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export function extractPublicId(imageUrl) {
  const matches = imageUrl.match(/codeorbitstudio\/([^/]+)/);
  return matches ? matches[0] : null;
}

export default cloudinary;