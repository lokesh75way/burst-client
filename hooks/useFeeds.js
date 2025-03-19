import { useState } from "react";

import useApp from "./useApp";

/**
 * Custom hook for managing feed-related operations.
 * @returns {{
 *   getFeedUsers: () => Promise<any>,
 *   feedForYou: () => Promise<any>
 * }}
 */
function useFeeds() {
    const { api } = useApp();
    const [loading, setLoading] = useState();

    /**
     * Fetches the list of all feed users.
     * @returns {Promise<any>} Promise resolving to the list of users.
     */
    const getFeedUsers = async () => {
        const { data } = await api.get(`/feeds/allUsersList`);
        return data;
    };

    /**
     * Fetches feed content personalized for the user.
     * @returns {Promise<any>} Promise resolving to personalized feed content.
     */
    const feedForYou = async (page = 1) => {
        setLoading(true);
        let data;
        try {
            const res = await api.get(
                `/feeds/feed-with-beta-reviews?page=${page}&limit=4`,
            );
            data = res.data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        return data;
    };

    /**
     * Fetches Channel Feed content personalized for the user.
     * @returns {Promise<any>} Promise resolving to personalized Channel feed content.
     */
    const communityFeed = async (channelId = 0, page = 1) => {
        setLoading(true);
        let data;
        try {
            const res = await api.get(
                `/feeds/feed-for-channel?page=${page}&channelId=${channelId}&limit=4`,
            );
            data = res.data;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
        return data;
    };

    return { getFeedUsers, feedForYou, loading, setLoading, communityFeed };
}

export default useFeeds;
