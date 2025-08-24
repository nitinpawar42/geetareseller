
'use server';

import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Uploads a product image to Firebase Storage.
 * @param file The image file to upload.
 * @param productId The ID of the product, used to create a unique path.
 * @returns The public URL of the uploaded image.
 */
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Create a storage reference
  const filePath = `products/${productId}/${file.name}`;
  const storageRef = ref(storage, filePath);

  try {
    // 'file' comes from the Blob or File API
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error) {
    console.error("Image upload failed: ", error);
    throw new Error("Could not upload the image.");
  }
};

/**
 * Deletes a product image from Firebase Storage.
 * @param productId The ID of the product.
 * @param fileName The name of the image file.
 */
export const deleteProductImage = async (productId: string, fileName: string): Promise<void> => {
    const filePath = `products/${productId}/${fileName}`;
    const storageRef = ref(storage, filePath);

    try {
        await deleteObject(storageRef);
        console.log(`Deleted image: ${filePath}`);
    } catch (error) {
        // It's okay if the file doesn't exist.
        if ((error as any).code === 'storage/object-not-found') {
            console.warn(`Image not found, could not delete: ${filePath}`);
            return;
        }
        console.error("Image deletion failed: ", error);
        throw new Error("Could not delete the image.");
    }
}
