import { supabase } from "../../supabaseClient.js";
import axiosClient from "./axiosClient.js";

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
export const loginLocal = async (username, password) => {
    const res = await axiosClient.post('/auth/login-local', {
        username, password
    });
    return res;
}

export const requestRegister = async (username, emailParent) => {
    const res = await axiosClient.post('/auth/request-register', {
        username, emailParent
    });
    return res;
}

export const verifyAndCreate = async (username, password, emailParent, relationship, idParent, otp) => {
    const res = await axiosClient.post('/auth/verify-and-create', {
        username, password, emailParent, relationship, idParent, otp
    });
    return res;
}
