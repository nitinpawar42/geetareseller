
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, DocumentData, QueryDocumentSnapshot, getDoc, Timestamp, writeBatch, serverTimestamp } from 'firebase/firestore';
import { seedProducts } from '@/services/seed-service';
import { uploadProductImage } from './storage-service';

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
    try {
        // First, create a document reference with a unique ID
        const productRef = doc(collection(db, 'products'));
        const productId = productRef.id;

        // Upload the image to Firebase Storage
        const imageUrl = await uploadProductImage(productData.imageFile, productId);

        // Create the product document in Firestore with the new image URL
        const { imageFile, ...firestoreData } = productData;
        
        await addDoc(collection(db, 'products'), {
            ...firestoreData,
            imageUrl,
            salesCount: 0, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return productId;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add product to the database.");
    }
};

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
