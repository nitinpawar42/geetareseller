
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { ProductData } from './product-service';

const sampleProducts: ProductData[] = [
  {
    name: 'AcousticPro Headphones',
    description: 'Experience crystal clear audio with our new noise-cancelling headphones.',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Electronics',
    stock: 150,
  },
  {
    name: 'ErgoFlow Office Chair',
    description: 'Stay comfortable and productive with our ergonomic office chair.',
    price: 349.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Furniture',
    stock: 75,
  },
  {
    name: 'Gourmet Coffee Blend',
    description: 'Start your day with our rich and aromatic premium coffee blend.',
    price: 24.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Groceries',
    stock: 300,
  },
  {
    name: 'Classic Leather Wallet',
    description: 'A timeless accessory, crafted from genuine leather.',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Accessories',
    stock: 200,
  },
  {
    name: 'YogaFlex Mat',
    description: 'High-grip, eco-friendly mat for your daily yoga practice.',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Sports',
    stock: 120,
  },
];

const sampleUsers = [
    { uid: 'admin-user', fullName: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'Active', joinedAt: new Date(), totalEarnings: 0, photoURL: 'https://placehold.co/100x100.png' },
    { uid: 'reseller-jane', fullName: 'Jane Doe', email: 'jane.doe@example.com', role: 'reseller', status: 'Active', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), totalEarnings: 1250.75, photoURL: 'https://placehold.co/100x100.png' },
    { uid: 'reseller-john', fullName: 'John Smith', email: 'john.smith@example.com', role: 'reseller', status: 'Active', joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), totalEarnings: 780.50, photoURL: 'https://placehold.co/100x100.png' },
    { uid: 'reseller-pending', fullName: 'Sam Pending', email: 'sam.pending@example.com', role: 'reseller', status: 'Pending', joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), totalEarnings: 0, photoURL: 'https://placehold.co/100x100.png' },
    { uid: 'reseller-inactive', fullName: 'Inactive Irma', email: 'irma.inactive@example.com', role: 'reseller', status: 'Inactive', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), totalEarnings: 25.00, photoURL: 'https://placehold.co/100x100.png' },
];


export const seedProducts = async () => {
    const batch = writeBatch(db);
    console.log("Seeding products...");
    
    sampleProducts.forEach(product => {
        const docRef = doc(collection(db, 'products'));
        batch.set(docRef, {
            ...product,
            salesCount: Math.floor(Math.random() * 500),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
        });
    });

    await batch.commit();
    console.log("Product seeding complete.");
};

export const seedUsers = async () => {
    const batch = writeBatch(db);
    console.log("Seeding users...");

    sampleUsers.forEach(user => {
        const docRef = doc(db, "users", user.uid);
        batch.set(docRef, user);
    });

    await batch.commit();
    console.log("User seeding complete.");
};
