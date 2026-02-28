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
export const loginLocal = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email, password
    });
    if (error) {
        throw error;
    }
    return data;
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


export const requestForgetPassword = async (username) => {
    const res = await axiosClient.post('/auth/request-forget-password', {
        username
    });
    return res;
}

export const verityResetOtp = async (username, emailParent, otp) => {
    const res = await axiosClient.post('/auth/verify-reset-otp', {
        username, emailParent, otp
    });
    return res;
}

export const resetPassword = async (token, newPassword) => {
    const res = await axiosClient.post('/auth/reset-password', {
        token, newPassword
    });
    return res;
}
export const signOut = async () => {
    const res = await axiosClient.post('/auth/sign-out');
    return res;
}
