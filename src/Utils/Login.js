import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

export const fLogin = async (username, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isBlocked) {
            
            await auth.signOut();
            throw new Error('Acesso negado. Sua conta está bloqueada.');
        }

        return { success: true, message: 'Login bem-sucedido' };
      } catch (error) {
        let errorMessage = 'Falha no login';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Usuário ou senha inválidos';
        } else if (error.message === 'Acesso negado. Sua conta está bloqueada.') {
            errorMessage = error.message; 
        }
        throw new Error(errorMessage);
    }
};
