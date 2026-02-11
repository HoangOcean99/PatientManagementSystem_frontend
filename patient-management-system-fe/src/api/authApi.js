import { supabase } from "../../supabaseClient.js";

export const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/oauth-callback`
        }
    });

    if (error) {
        throw error;
    }
    return data;
};
