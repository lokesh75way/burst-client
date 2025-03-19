import useApp from "./useApp";

function useChannels() {
    const { api } = useApp();

    const getChannels = async () => {
        const { data } = await api.get("/channels");
        return data;
    };

    const createChannel = async (payload) => {
        const { data } = await api.post("/channels", payload);
        return data;
    };

    const getMyChannels = async () => {
        const { data } = await api.get("/channels/my");
        return data;
    };

    const getRecommendedChannels = async () => {
        const { data } = await api.get("/channels/recommended");
        return data;
    };

    const editChannel = async (channelId, payload) => {
        const { data } = await api.put(`/channels/${channelId}`, payload);
        return data;
    };

    const addRemoveUser = async (channelId, type) => {
        const { data } = await api.put(
            `/channels/addRemoveUser/${channelId}`,
            type,
        );
        return data;
    };

    const searchChannel = async (channelTag) => {
        const { data } = await api.get(`/channels/search?tag=${channelTag}`);
        return data;
    };

    const deleteChannel = async (channelId) => {
        const { data } = await api.delete(`/channels/${channelId}`);
        return data;
    };

    const getSuggestedChannels = async (postId) => {
        const { data } = await api.get(`/channels/suggested/${postId}`);
        return data;
    };

    const getChannelById = async (channelId) => {
        const { data } = await api.get(`/channels/${channelId}`);
        return data;
    };

    const getBurstedChannels = async (postId) => {
        const { data } = await api.get(`/channels/burstedChannels/${postId}`);
        return data;
    };

    return {
        getChannels,
        getMyChannels,
        createChannel,
        editChannel,
        getRecommendedChannels,
        addRemoveUser,
        deleteChannel,
        searchChannel,
        getChannelById,
        getSuggestedChannels,
        getBurstedChannels,
    };
}

export default useChannels;
