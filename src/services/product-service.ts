
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

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
    sales: number; // Assuming sales start at 0
}

export type ProductData = Omit<Product, 'id' | 'sales'>;


const productFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
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
    };
};

export const addProduct = async (productData: ProductData): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            ...productData,
            sales: 0, // Initialize sales
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
        return querySnapshot.docs.map(productFromDoc);
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Could not fetch products from the database.");
    }
};
