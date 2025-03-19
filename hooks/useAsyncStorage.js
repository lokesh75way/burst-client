import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * @typedef {Object} StorageKeys
 * @property {string} Token - Key for storing token in AsyncStorage.
 * @property {string} Id - Key for storing ID in AsyncStorage.
 */

/**
 * Custom hook for handling AsyncStorage operations.
 * @param {function} [onLoadCB=()=>{}] - Callback function executed on load.
 * @returns {{
 *   token: string,
 *   id: string,
 *   setToken: (token: string) => Promise<void>,
 *   setId: (id: string) => Promise<void>,
 *   getItem: (key: string) => Promise<string>,
 *   setItem: (key: string, value: string) => Promise<void>,
 *   loading: boolean
 * }}
 */
function useAsyncStorage(onLoadCB = () => {}) {
    /** @type {StorageKeys} */
    const storageKeys = {
        Token: "token",
        Id: "id",
        IsOnboarded: "isOnboarded",
    };

    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState({
        [storageKeys.Token]: "",
        [storageKeys.Id]: "",
        [storageKeys.IsOnboarded]: "",
    });

    /**
     * Set token in AsyncStorage and update state.
     * @param {string} [token=""]
     * @returns {Promise<void>}
     */
    const setToken = async (token = "") => {
        await AsyncStorage.setItem(storageKeys.Token, token ?? "");
        setValues((value) => ({ ...value, [storageKeys.Token]: token }));
    };

    /**
     * Set ID in AsyncStorage and update state.
     * @param {string} [id=""]
     * @returns {Promise<void>}
     */
    const setId = async (id = "") => {
        await AsyncStorage.setItem(storageKeys.Id, id);
        setValues((value) => ({ ...value, [storageKeys.Id]: id }));
    };

    const setIsOnboarded = async (isOnboarded = "false") => {
        await AsyncStorage.setItem(storageKeys.IsOnboarded, isOnboarded);
        setValues((value) => ({
            ...value,
            [storageKeys.IsOnboarded]: isOnboarded,
        }));
    };

    /**
     * Get item from AsyncStorage.
     * @param {string} key - Key to retrieve from AsyncStorage.
     * @returns {Promise<string>}
     * @throws {Error} Throws an error if the key is undefined.
     */
    const getItem = async (key) => {
        if (typeof key === "undefined") throw new Error("Invalid key");
        return await AsyncStorage.getItem(key);
    };

    /**
     * Set item in AsyncStorage.
     * @param {string} key - Key to set in AsyncStorage.
     * @param {string} value - Value to set in AsyncStorage.
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the key is undefined.
     */
    const setItem = async (key, value) => {
        if (typeof key === "undefined") throw new Error("Invalid key");
        await AsyncStorage.setItem(key, value);
    };

    /**
     * Initialize AsyncStorage values on component load.
     * @returns {Promise<void>}
     */
    const initLoad = async () => {
        try {
            const token = await getItem(storageKeys.Token);
            const id = await getItem(storageKeys.Id);
            const isOnboarded = await getItem(storageKeys.IsOnboarded);
            onLoadCB(token, id);
            setValues({
                [storageKeys.Token]: token || "",
                [storageKeys.Id]: id || "",
                [storageKeys.IsOnboarded]: isOnboarded || "",
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        initLoad();
    }, []);

    return {
        token: values[storageKeys.Token],
        id: values[storageKeys.Id],
        isOnboarded: values[storageKeys.IsOnboarded],
        setToken,
        setItem,
        setIsOnboarded,
        setId,
        getItem,
        loading,
    };
}

export default useAsyncStorage;
