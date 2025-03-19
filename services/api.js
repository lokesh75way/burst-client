import axios from "axios";
import { showMessage } from "react-native-flash-message";

import { apiBaseUrl, notificationApiBaseUrl } from "../config/constants";

/**
 * Creates an Axios instance with authorization headers for API requests.
 * @param {string} [token=""] - Token used for authorization.
 * @returns {import("axios").AxiosInstance} Axios instance configured with headers.
 */
export const createInstance = (token = "") => {
    const authToken = token ? `Bearer ${token}` : undefined;
    const instance = axios.create({
        baseURL: apiBaseUrl,
        headers: {
            common: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        },
    });

    instance.interceptors.response.use(
        (response) => {
            if (response.status === 401) {
                alert("You are not authorized");
            }
            return response;
        },
        (error) => {
            if (error.response.status === 400) {
                showMessage({
                    message: error.response.data.message,
                    type: "danger",
                });
            }
            if (error.response.status >= 500) {
                showMessage({
                    message: "Sorry retry later",
                    type: "danger",
                });
                console.log("Error: ", error.response);
            }
            if (error.response && error.response.data) {
                return Promise.reject(error.response.data);
            }
            return Promise.reject(error.message);
        },
    );

    return instance;
};

/**
 * Creates an Axios instance for notification requests.
 * @returns {import("axios").AxiosInstance} Axios instance configured for notifications.
 */
export const createNotificationInstance = () => {
    const instance = axios.create({
        baseURL: notificationApiBaseUrl,
    });
    return instance;
};
