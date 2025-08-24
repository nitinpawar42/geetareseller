

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { seedUsers } from '@/services/seed-service';

// Represents an admin or reseller
export interface User {
    uid: string; // Firebase Auth UID
    fullName: string;
    email: string;
    role: 'reseller' | 'admin';
    status: 'Active' | 'Pending' | 'Inactive' | 'Suspended';
    joinedAt: Date;
    totalEarnings: number;
    photoURL?: string;
}

const userFromDoc = (doc: QueryDocumentSnapshot<DocumentData> | DocumentData): User => {
    const data = doc.data();
    if (!data) {
        throw new Error('Document data is empty');
    }
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

        const isAdmin = email.toLowerCase() === 'nitinpawar41@gmail.com';

        const newUser: Omit<User, 'uid'> = {
            fullName,
            email,
            role: isAdmin ? 'admin' : 'reseller',
            status: 'Active', 
            totalEarnings: 0,
            photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${fullName.charAt(0)}`,
            joinedAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), newUser);

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

export const registerAdmin = async (email: string, password: string, fullName: string): Promise<string> => {
    try {
        // This will create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // This will create the user document in Firestore
        const newAdmin: Omit<User, 'uid'> = {
            fullName,
            email,
            role: 'admin',
            status: 'Active',
            joinedAt: new Date(),
            totalEarnings: 0,
            photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${fullName.charAt(0)}`,
        };

        await setDoc(doc(db, 'users', user.uid), newAdmin);

        return user.uid;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
             console.warn('Admin email already exists in Auth. The login flow will attempt to fetch or create the user data in Firestore.');
             // This is not necessarily a fatal error in the login flow, so we re-throw to let the caller handle it.
             throw error;
        }
        console.error("Error creating admin: ", error);
        throw new Error("Could not create admin account.");
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '!=', 'admin')); // Exclude admin from user list
        const querySnapshot = await getDocs(q);

         if (querySnapshot.empty) {
            console.log("No users found, seeding database...");
            await seedUsers();
            const seededSnapshot = await getDocs(q);
            return seededSnapshot.docs.map(userFromDoc);
        }
        return querySnapshot.docs.map(userFromDoc);
    } catch (e) {
        console.error("Error getting users: ", e);
        throw new Error("Could not fetch users from the database.");
    }
};

export const getUser = async (uid: string): Promise<User | null> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userFromDoc(userDoc);
        } else {
            // This can happen if a user was created in Auth but not in Firestore.
            // Let's create the user doc on the fly.
            console.warn(`User document not found for UID ${uid}. Checking Auth user.`);
            const authUser = auth.currentUser;

            // Ensure the currently authenticated user is the one we're looking for
            if (authUser && authUser.uid === uid) {
                 const newUser: Omit<User, 'uid'> = {
                    fullName: authUser.displayName || 'New User',
                    email: authUser.email!,
                    // Default to reseller, as admin creation is handled separately and explicitly.
                    role: authUser.email === 'nitinpawar41@gmail.com' ? 'admin' : 'reseller',
                    status: 'Active',
                    totalEarnings: 0,
                    joinedAt: new Date(),
                    photoURL: authUser.photoURL || `https://placehold.co/100x100.png?text=${(authUser.displayName || 'N').charAt(0)}`,
                };
                console.log(`Creating user document for ${newUser.email} with role ${newUser.role}`);
                await setDoc(userDocRef, newUser);
                const newUserDoc = await getDoc(userDocRef);
                return userFromDoc(newUserDoc);
            }
             console.log(`No authenticated user found or UID mismatch. Cannot create user document for UID ${uid}.`);
             return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user data.");
    }
}

export const updateUserStatus = async (uid: string, status: User['status']): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { status });
    } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Could not update user status.");
    }
};
