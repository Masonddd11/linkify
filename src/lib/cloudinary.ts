import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadImageOptions = {
  buffer: Uint8Array;
  userId: number;
  folder?: string;
  tags?: string[];
  transformation?: Array<{
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
  }>;
};

export const uploadProfileImage = async ({
  buffer,
  userId,
  folder = "profile_pictures",
  tags = [],
  transformation = [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
}: UploadImageOptions): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      public_id: `user_${userId}`,
      overwrite: true,
      tags: ["profile_picture", `user_${userId}`, ...tags],
      resource_type: "image" as const,
      transformation,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result!);
      })
      .end(buffer);
  });
};

export const uploadImage = async ({
  buffer,
  userId,
  folder = "images",
  tags = [],
  transformation = [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
}: UploadImageOptions): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      public_id: `user_${userId}_${Date.now()}`,
      overwrite: true,
      tags: ["images", `user_${userId}`, ...tags],
      resource_type: "image" as const,
      transformation,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result!);
      })
      .end(buffer);
  });
};

export default cloudinary;
