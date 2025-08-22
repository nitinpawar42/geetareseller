
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export interface User {
    uid: string;
    fullName: string;
    email: string;
    role: 'reseller' | 'admin';
    status: 'Active' | 'Pending' | 'Inactive';
    joined: Date;
    totalEarnings: number;
    photoURL?: string;
}

const userFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): User => {
    const data = doc.data();
    return {
        uid: doc.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
        joined: data.joined.toDate(), // Convert Firestore Timestamp to Date
        totalEarnings: data.totalEarnings,
        photoURL: data.photoURL,
    };
};

export const registerReseller = async (email: string, password: string, fullName: string): Promise<string> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newUser: Omit<User, 'uid'> = {
            fullName,
            email,
            role: 'reseller',
            status: 'Active', // Or 'Pending' if you want an approval process
            joined: new Date(),
            totalEarnings: 0,
            photoURL: user.photoURL || '',
        };

        // Add user data to Firestore, using UID as the document ID
        await setDoc(doc(db, 'users', user.uid), newUser);

        return user.uid;
    } catch (error: any) {
        // Provide more specific error messages
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
        return querySnapshot.docs.map(userFromDoc);
    } catch (e) {
        console.error("Error getting users: ", e);
        throw new Error("Could not fetch users from the database.");
    }
};
