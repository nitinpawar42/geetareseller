
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, DocumentData, QueryDocumentSnapshot, getDoc, Timestamp, writeBatch, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { seedProducts } from '@/services/seed-service';
import { deleteProductImage, uploadProductImage } from './storage-service';

export interface Product {
    id: string; // Document ID
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    stock: number;
    // Optional details
    weight?: number; // in kg
    dimensions?: {
        length?: number; // in cm
        breadth?: number; // in cm
        height?: number; // in cm
    };
    // Tracking fields
    salesCount: number; 
    createdAt: Date;
    updatedAt: Date;
}

export type ProductFormData = Omit<Product, 'id' | 'salesCount' | 'createdAt' | 'updatedAt' | 'imageUrl'> & {
    imageFile: File;
};

export type EditProductFormData = Omit<Product, 'id' | 'salesCount' | 'createdAt' | 'updatedAt' | 'imageUrl'> & {
    imageFile?: File; // Make image optional for editing
    imageUrl: string; // Keep existing image url
};


const productFromDoc = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        stock: data.stock,
        category: data.category,
        weight: data.weight,
        dimensions: data.dimensions,
        salesCount: data.salesCount || 0,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
};

export const addProduct = async (productData: ProductFormData): Promise<string> => {
    const productRef = doc(collection(db, 'products'));
    const productId = productRef.id;

    try {
        const imageUrl = await uploadProductImage(productData.imageFile, productId);
        const { imageFile, ...firestoreData } = productData;
        
        await setDoc(productRef, {
            ...firestoreData,
            imageUrl,
            salesCount: 0, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return productId;
    } catch (e) {
        console.error("Error adding document: ", e);
        // If firestore fails, delete the uploaded image
        await deleteProductImage(productId, productData.imageFile.name).catch(err => console.error("Failed to delete orphaned image.", err));
        throw new Error("Could not add product to the database.");
    }
};

export const updateProduct = async (productId: string, productData: EditProductFormData): Promise<void> => {
    try {
        const productRef = doc(db, 'products', productId);
        let imageUrl = productData.imageUrl;

        // If a new image file is provided, upload it and update the URL
        if (productData.imageFile) {
            // In a real app, you might want to delete the old image first.
            // For simplicity, we'll just upload the new one.
            imageUrl = await uploadProductImage(productData.imageFile, productId);
        }

        const { imageFile, ...firestoreData } = productData;

        await updateDoc(productRef, {
            ...firestoreData,
            imageUrl,
            updatedAt: serverTimestamp(),
        });

    } catch (e) {
        console.error("Error updating document: ", e);
        throw new Error("Could not update product in the database.");
    }
}

export const deleteProduct = async (productId: string): Promise<void> => {
    try {
        const productRef = doc(db, 'products', productId);
        // In a real app, you might want to delete associated images from storage as well.
        await deleteDoc(productRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete product from the database.");
    }
}


export const getProducts = async (): Promise<Product[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (querySnapshot.empty) {
            console.log("No products found, seeding database...");
            await seedProducts();
            const seededSnapshot = await getDocs(collection(db, "products"));
            return seededSnapshot.docs.map(productFromDoc);
        }
        return querySnapshot.docs.map(productFromDoc);
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Could not fetch products from the database.");
    }
};

export const getProduct = async (id: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return productFromDoc(docSnap);
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        throw new Error("Could not fetch product from the database.");
    }
}
