// src/utils/criarconta.js

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

export const register = async (name, email, password, dataNascimento, matricula) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            dataNascimento, 
            matricula, 
            isBlocked: false 
        });

        return { success: true, message: 'Account created successfully', user };
    } catch (error) {
        let errorMessage = 'Registration failed';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email already in use';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Weak password';
        }
        throw new Error(errorMessage);
    }
};
