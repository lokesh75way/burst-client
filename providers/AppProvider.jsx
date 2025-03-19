/**
 * @file Provides AppProvider component with context for API and authentication.
 * @module AppProvider
 */

import React, { createContext, useEffect, useState } from "react";

import useAsyncStorage from "../hooks/useAsyncStorage";
import { createInstance, createNotificationInstance } from "../services/api";

/**
 * Default values for the AppContext.
 * @constant
 * @type {Object}
 */
const defaultValue = {
    api: createInstance(""), // Initialize API instance with an empty base URL
    notification: createNotificationInstance(""), // Initialize notification instance with an empty base URL
};

/**
 * Context for the application.
 * @type {React.Context}
 */
export const AppContext = createContext(defaultValue);

/**
 * Provides context for the application including API, authentication, and storage.
 * @param {Object} props - React component properties.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} AppProvider component.
 */
function AppProvider({ children }) {
    const api = defaultValue.api;
    const storage = useAsyncStorage((token) => {
        setToken(token);
    });
    const [activeRoute, setActiveRoute] = useState("Home");
    const [userData, setUserData] = useState(null);
    const [inviter, setInviter] = useState(null);
    const [updatedCounts, setUpdatedCounts] = useState([]);
    const [userJoinedChannels, setUserJoinedChannels] = useState([]);
    const [postReactions, setPostReactions] = useState();
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [reload, setReload] = useState(false);
    const [reloadProfile, setReloadProfile] = useState(true);
    const [totalMemory, setTotalMemory] = useState(0);
    const [globalBurstedChannels, setGlobalBurstedChannels] = useState({});

    /**
     * Function to perform logout action.
     * Clears authorization header and storage data.
     * @async
     * @returns {Promise<void>}
     */
    const logout = async () => {
        await storage.setToken("");
        await storage.setId("");
        await storage.setIsOnboarded("");
        delete api.defaults.headers.common.Authorization;
    };

    /**
     * Function to set authentication token in API instance and storage.
     * @async
     * @param {string} token - Authentication token.
     * @returns {Promise<void>}
     */
    const setToken = async (token) => {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await storage.setToken(token);
    };

    useEffect(() => {
        // Set token in API instance if available in storage on component mount
        if (storage.token) {
            setToken(storage.token);
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                api,
                logout,
                storage: { ...storage, setToken }, // Spread storage properties and include setToken function
                notification: defaultValue.notification,
                activeRoute,
                setActiveRoute,
                inviter,
                setInviter,
                userData,
                setUserData,
                updatedCounts,
                setUpdatedCounts,
                postReactions,
                setPostReactions,
                unreadNotificationCount,
                setUnreadNotificationCount,
                reload,
                setReload,
                reloadProfile,
                setReloadProfile,
                userJoinedChannels,
                setUserJoinedChannels,
                totalMemory,
                setTotalMemory,
                globalBurstedChannels,
                setGlobalBurstedChannels,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
