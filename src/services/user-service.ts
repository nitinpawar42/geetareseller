
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp } from 'firebase/firestore';

// Represents an admin or reseller
export interface User {
    uid: string; // Firebase Auth UID
    fullName: string;
    email: string;
    role: 'reseller' | 'admin';
    status: 'Active' | 'Pending' | 'Inactive';
    joinedAt: Date;
    totalEarnings: number;
    photoURL?: string;
}

const userFromDoc = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): User => {
    const data = doc.data();
    return {
        uid: doc.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
        joinedAt: (data.joinedAt as Timestamp)?.toDate() || new Date(),
        totalEarnings: data.totalEarnings,
        photoURL: data.photoURL,
    };
};

export const registerReseller = async (email: string, password: string, fullName: string): Promise<string> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newUser: Omit<User, 'uid' | 'joinedAt'> = {
            fullName,
            email,
            role: 'reseller',
            status: 'Active', 
            totalEarnings: 0,
            photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${fullName.charAt(0)}`,
        };

        await setDoc(doc(db, 'users', user.uid), {
            ...newUser,
            joinedAt: new Date(),
        });

        return user.uid;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        }
        if (error.code === 'auth/weak-password') {
            throw new Error('The password is too weak.');
        }
        console.error("Error creating user: ", error);
        throw new Error("Could not create user account.");
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
         if (querySnapshot.empty) {
            console.log("No users found, seeding database...");
            const { seedUsers } = await import('@/services/seed-service');
            await seedUsers();
            const seededSnapshot = await getDocs(collection(db, 'users'));
            return seededSnapshot.docs.map(userFromDoc);
        }
        return querySnapshot.docs.map(userFromDoc);
    } catch (e) {
        console.error("Error getting users: ", e);
        throw new Error("Could not fetch users from the database.");
    }
};
