
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, doc, writeBatch } from 'firebase/firestore';

export interface Customer {
    name: string;
    email: string;
    address: {
        line1: string;
        city: string;
        zip: string;
    };
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface Commission {
    resellerId: string;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
}

export interface Order {
    id: string; // Document ID
    customer: Customer;
    items: OrderItem[];
    // Financials
    subtotal: number;
    shipping: number;
    handling: number;
    taxes: number;
    total: number;
    // Commission details
    commission: Commission;
    // Status and timestamps
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export type OrderData = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

export const createOrder = async (orderData: OrderData): Promise<string> => {
    const batch = writeBatch(db);

    try {
        // 1. Create the order document
        const orderRef = doc(collection(db, 'orders'));
        batch.set(orderRef, {
            ...orderData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 2. Create the commission document
        const commissionRef = doc(collection(db, 'commissions'));
        batch.set(commissionRef, {
            ...orderData.commission,
            orderId: orderRef.id,
            createdAt: new Date(),
        });
        
        // 3. (Optional) Create or update customer document
        // For simplicity, we embed customer data. In a real app, you might
        // want a separate customers collection.

        // 4. Update product stock and sales count
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.productId);
            batch.update(productRef, {
                stock: -item.quantity, // Firestore will decrement the value
                salesCount: item.quantity, // Firestore will increment the value
            });
        }

        await batch.commit();
        return orderRef.id;

    } catch (e) {
        console.error("Error creating order: ", e);
        throw new Error("Could not create the order.");
    }
};
