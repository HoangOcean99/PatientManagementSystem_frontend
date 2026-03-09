import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSession = async (session) => {
        if (session?.user) {
            setUser(session.user);
            setUserId(session.user.id);

            const { data: profile } = await supabase
                .from("Users")
                .select("role")
                .eq("user_id", session.user.id)
                .single();

            setUserRole(profile?.role ?? null);
        } else {
            setUser(null);
            setUserId(null);
            setUserRole(null);
        }

        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, userId, userRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);