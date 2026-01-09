import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    currentUser: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setCurrentUser(session?.user ?? null);
            setLoading(false);

            if (session?.user) {
                // Sync with local storage for legacy code
                const userData = {
                    email: session.user.email,
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
                    uid: session.user.id
                };
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                localStorage.removeItem('user');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signup = async (email: string, password: string, name: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            });

            if (error) throw error;

            // Note: Trigger in database.sql handles profile creation automatically
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, session, loading, signInWithGoogle, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
