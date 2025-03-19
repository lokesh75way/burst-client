import { useState } from "react";

import useApp from "./useApp";

/**
 * Custom hook managing authentication-related functionality.
 * @returns {{
 *   login: (email: string, password: string) => Promise<any>,
 *   register: (payload?: any) => Promise<any>
 * }}
 */
function useAuth() {
    const { api, storage } = useApp();
    const [loading, setLoading] = useState(false);

    /**
     * Verifies the provided email by making a POST request to the '/users/verify-email' API endpoint.
     * @param {string} email - The email address to be verified.
     * @returns {Promise<Object>} - A Promise that resolves to the data returned from the API.
     */
    const verifyEmail = async (email) => {
        const { data } = await api.post(
            "/users/verify-email",
            JSON.stringify({ email }),
        );
        return data;
    };

    /**
     * Resets the password associated with the provided email by making a POST request to the '/users/reset-password' API endpoint.
     * @param {string} email - The email address for which the password will be reset.
     * @param {string} password - The new password to be set.
     * @returns {Promise<Object>} - A Promise that resolves to the data returned from the API.
     */
    const resetPassword = async (email, password) => {
        const { data } = await api.post(
            "/users/reset-password",
            JSON.stringify({ email, password }),
        );
        return data;
    };

    /**
     * Initiates the process of resetting a forgotten password by making a POST request to the '/users/forgot-password' API endpoint.
     * @param {string} email - The email address for which the password needs to be reset.
     * @returns {Promise<Object>} - A Promise that resolves to the data returned from the API.
     */
    const forgotPassword = async (email) => {
        const { data } = await api.post(
            "/users/forgot-password",
            JSON.stringify({ email }),
        );
        return data;
    };

    /**
     * Verifies the OTP (One-Time Password) for a given email.
     * @param {string} email - The email address associated with the OTP.
     * @param {string} otp - The One-Time Password to verify.
     * @returns {Promise<Object>} - A Promise that resolves to the data returned from the API.
     */
    const verifyOtp = async (email, otp) => {
        const { data } = await api.post(
            "/users/verify-otp",
            JSON.stringify({ email, otp }),
        );
        return data;
    };

    /**
     * Logs a user in by making a POST request to the server.
     * @param {string} email - User's email address.
     * @param {string} password - User's password.
     * @returns {Promise<any>} - Data returned after successful login.
     */
    const login = async (email, password) => {
        setLoading(true);
        let result;
        try {
            const { data } = await api.post(
                "/users/signin",
                JSON.stringify({ password, email }),
            );
            console.log("data:", data);
            result = data;
        } catch (error) {
            console.log("login: ", error);
        } finally {
            setLoading(false);
        }
        return result;
    };

    /**
     * Registers a new user by making a POST request to the server.
     * @param {Object} [payload={}] - User data for registration.
     * @returns {Promise<any>} - Data returned after successful registration.
     */
    const register = async (payload = {}) => {
        const { data } = await api.post("/users/signup", payload);
        return data;
    };

    /**
     * Resend OTP by making a POST request to the server.
     * @param {string} email - User's email address.
     * @returns {Promise<any>} - Data returned after OTP is sent successfully.
     */
    const resendOtp = async (email) => {
        const { data } = await api.post(
            "users/resend-otp",
            JSON.stringify({ email }),
        );
        return data;
    };

    return {
        login,
        register,
        forgotPassword,
        verifyOtp,
        resetPassword,
        verifyEmail,
        loading,
        resendOtp,
    };
}

export default useAuth;
