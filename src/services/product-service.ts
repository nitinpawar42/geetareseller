
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, DocumentData, QueryDocumentSnapshot, getDoc, Timestamp } from 'firebase/firestore';

export interface Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    category: string;
    weight?: number;
    dimensions?: {
        length?: number;
        breadth?: number;
        height?: number;
    };
    sales: number; 
    createdAt: Date;
}

export type ProductData = Omit<Product, 'id' | 'sales' | 'createdAt'>;


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
        sales: data.sales || 0,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
};

export const addProduct = async (productData: ProductData): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            ...productData,
            sales: 0, 
            createdAt: new Date(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add product to the database.");
    }
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (querySnapshot.empty) {
            const { seedProducts } = await import('@/services/seed-service');
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
