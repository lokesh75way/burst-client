import { useState } from "react";

import useApp from "./useApp";

/**
 * Hook for managing social-related API operations.
 * @returns {{
 *   getCircles: (number: number) => Promise<any>,
 *   getFollowing: () => Promise<any>,
 *   getSocialFollowing: () => Promise<any>,
 *   getFollowers: () => Promise<any>,
 *   deleteUser: (level: number, payload: object) => Promise<any>,
 *   addUser: (level: number, payload: object) => Promise<any>,
 *   searchSocialUser: (userName: string) => Promise<any>,
 *   searchSocialFollower: (query: string) => Promise<any>,
 *   addFollowing: (followingUserId: Array<number>) => Promise<any>,
 *   addSocialFollowing: (followingUserId: Array<number>) => Promise<any>,
 *   removeSocialFollowing: (followingUserId: number) => Promise<any>
 * }}
 */
function useSocials() {
    const { api } = useApp();
    const [loading, setLoading] = useState(false);

    /**
     * Get circles based on a number.
     * @param {number} number - Number for circles.
     * @returns {Promise<any>} - Circles data.
     */
    const getCircles = async (number) => {
        setLoading(true);
        const { data } = await api.get(`/socials/circles/${number}`);
        setLoading(false);
        return data.members;
    };

    /**
     * Get users that are being followed.
     * @returns {Promise<any>} - Following data.
     */
    const getFollowing = async () => {
        setLoading(true);
        const { data } = await api.get(`/socials/following`);
        setLoading(false);
        return data;
    };

    /**
     * Retrieve social following data.
     * @returns {Promise<any>} - Social following data.
     */
    const getSocialFollowing = async () => {
        setLoading(true);
        const { data } = await api.get(`/socials/following`);
        setLoading(false);
        return data;
    };

    /**
     * Retrieve followers data.
     * @returns {Promise<any>} - Followers data.
     */
    const getFollowers = async () => {
        const { data } = await api.get(`/socials/followers`);
        return data;
    };

    /**
     * Delete a user from a specific level.
     * @param {number} level - Level from which to delete the user.
     * @param {object} payload - Payload for deletion.
     * @returns {Promise<any>} - Deletion result.
     */
    const deleteUser = async (level, payload) => {
        const { data } = await api.delete(
            `/socials/circles/${level}/users`,
            payload,
        );
        return data;
    };

    /**
     * Add a user to a specific level.
     * @param {number} level - Level to which to add the user.
     * @param {object} payload - Payload for adding the user.
     * @returns {Promise<any>} - Result after adding the user.
     */
    const addUser = async (level, payload) => {
        const { data } = await api.get(
            `/socials/circles/${level}/users`,
            payload,
        );
        return data;
    };

    /**
     * Search for a social user based on username.
     * @param {string} userName - Username to search for.
     * @returns {Promise<any>} - User data matching the username.
     */
    const searchSocialUser = async (userName) => {
        const { data } = await api.get(`/socials/users?userName=${userName}`);
        return data;
    };

    const recommendInvitations = async () => {
        const { data } = await api.get(`/socials/recommend-users?limit=3`);
        return data;
    };

    /**
     * Search for social followers based on a query.
     * @param {string} query - Query string to search followers.
     * @returns {Promise<any>} - Followers data matching the query.
     */
    const searchSocialFollower = async (query) => {
        const { data } = await api.get(
            `/socials/followers?searchQuery=${query}`,
        );
        return data;
    };

    const searchSocialFollowing = async (query) => {
        const { data } = await api.get(
            `/socials/following?searchQuery=${query}`,
        );
        return data;
    };

    /**
     * Add following users.
     * @param {number[]} [followingUserId=[]] - Array of user IDs to follow.
     * @returns {Promise<any>} - Result after following users.
     */
    const addFollowing = async (followingUserId = []) => {
        const { data } = await api.post(
            `/socials/following`,
            JSON.stringify({
                followingUserId,
            }),
        );
        return data;
    };

    /**
     * Add social following users.
     * @param {number[]} [followingUserId=[]] - Array of user IDs to follow.
     * @returns {Promise<any>} - Result after following users.
     */
    const addSocialFollowing = async (followingUserId = []) => {
        const { data } = await api.post(
            `/socials/following`,
            JSON.stringify({
                followingUserId,
            }),
        );
        return data;
    };

    /**
     * Remove social following for a specific user.
     * @param {number} followingUserId - User ID to unfollow.
     * @returns {Promise<any>} - Result after unfollowing the user.
     */
    const removeSocialFollowing = async (followingUserId) => {
        const { data } = await api.post(
            `/socials/unfollow`,
            JSON.stringify({
                followingUserId,
            }),
        );
        return data;
    };

    return {
        getCircles,
        getFollowing,
        addFollowing,
        addUser,
        getFollowers,
        deleteUser,
        getSocialFollowing,
        addSocialFollowing,
        removeSocialFollowing,
        searchSocialUser,
        searchSocialFollower,
        searchSocialFollowing,
        recommendInvitations,
        loading,
    };
}

export default useSocials;
