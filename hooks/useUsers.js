import useApp from "./useApp";

/**
 * Hook for managing user-related API operations.
 * @returns {{
 *   me: () => Promise<any>,
 *   getProfile: (userId: number) => Promise<any>,
 *   uploadProfileImage: (payload: object) => Promise<any>
 * }}
 */
function useUsers() {
    const { api } = useApp();

    /**
     * Retrieve data for the currently authenticated user.
     * @returns {Promise<any>} - Data for the authenticated user.
     */
    const me = async () => {
        let data;
        try {
            const res = await api.get(`/users/me`);
            data = res.data;
        } catch (error) {
            console.log(error);
        }
        return data;
    };

    const onboardUser = async (isOnboarded = false) => {
        const { data } = await api.put(
            `/users/onboard`,
            JSON.stringify({
                isOnboarded,
            }),
        );
        return data;
    };

    /**
     * Retrieve profile data for a specific user.
     * @param {number} userId - ID of the user.
     * @returns {Promise<any>} - Profile data for the user.
     */
    const getProfile = async (userId) => {
        const { data } = await api.get(`/users/profiles/${userId}`);
        return data;
    };

    /**
     * Upload a profile image for the authenticated user.
     * @param {object} payload - Image data payload.
     * @returns {Promise<any>} - Result after uploading the image.
     */
    const uploadProfileImage = async (payload) => {
        const { data } = await api.post(`users/me/profileImage`, payload);
        return data;
    };

    const deviceTokenSave = async (deviceToken) => {
        const { data } = await api.patch(
            `/users/device-token`,
            JSON.stringify({
                deviceToken,
            }),
        );
        return data;
    };

    const updateProfile = async (isNotification = false) => {
        const { data } = await api.put(
            `/users/me`,
            JSON.stringify({
                isNotification,
            }),
        );
        return data;
    };

    const uploadDefaultBg = async (key = "") => {
        const { data } = await api.post("/users/default-bgs", { key });
        return data;
    };

    const getDefaultBgs = async () => {
        const { data } = await api.get("/users/default-bgs");
        return data;
    };

    const deleteDefaultBg = async (backgroundId) => {
        const { data } = await api.delete(`/users/default-bgs/${backgroundId}`);
        return data;
    };

    const updateDefaultBg = async (backgroundId) => {
        const { data } = await api.put(`/users/default-bgs/${backgroundId}`);
        return data;
    };

    /**
     * Delete profile and its data of the currently authenticated user.
     * @returns {Promise<any>} - Data for the authenticated user.
     */
    const deleteMe = async () => {
        const { data } = await api.delete(`/users/me`);
        return data;
    };

    const getNotification = async ({ page }) => {
        const { data } = await api.get(
            `/users/notification?page=${page}&limit=20`,
        );
        return data;
    };

    const getUnreadNotificationCount = async () => {
        const { data } = await api.get(`/users/unread-notification`);
        return data;
    };

    const getAllUsers = async () => {
        const { data } = await api.get(`/users/allUsersList`);
        return data;
    };

    const changeUsernameAndDisplayname = async (userName, displayName) => {
        const { data } = await api.put("/users/displayName", {
            userName,
            displayName,
        });
        return data;
    };

    return {
        me,
        getProfile,
        uploadProfileImage,
        deviceTokenSave,
        deleteMe,
        updateProfile,
        getNotification,
        getUnreadNotificationCount,
        onboardUser,
        uploadDefaultBg,
        getDefaultBgs,
        updateDefaultBg,
        deleteDefaultBg,
        getAllUsers,
        changeUsernameAndDisplayname,
    };
}

export default useUsers;
