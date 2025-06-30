import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { AuthContext } from './AuthContext';
import { auth } from '../Firebase/firebase.init';

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    // google log in
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, provider)
    }

    const userSignOut = () => {
        return signOut(auth)
    }

    // to observe the authentic user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            setUser(user)
            setLoading(false)

            // to always see the ser info at consol
            console.log(user);
        });


        return () => unsubscribe();
    }, [])


    // sharing all context info
    const authInfo = {
        user,
        setUser,
        errorMessage,
        setErrorMessage,
        loading,
        setLoading,
        createUser,
        logInUser,
        signInWithGoogle,
        userSignOut,
        searchQuery,
        setSearchQuery
    }

    return (
        <div>
            <AuthContext value={authInfo}>
                {children}
            </AuthContext>
        </div>
    );
};

export default AuthProvider;