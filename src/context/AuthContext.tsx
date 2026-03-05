import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";

// TS type - the context will hold a user (or null) and a loading flag
type AuthContextType = {
    user: User | null;
    loading: boolean;
};

// The context
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// The provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser); // null if logged out, User object if logged in
            setLoading(false);
        });
        return unsubscribe;
    }, []); // empty array = run this only once, on mount

    // Provide the user and loading state to all children
    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
