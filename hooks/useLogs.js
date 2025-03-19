import useApp from "./useApp";

function useLogs() {
    const { api } = useApp();

    const logUIRenderTime = async (id, time) => {
        const { data } = await api.put(`/logs/${id}`, {
            uiRenderingTime: time,
        });
        return data;
    };
    return { logUIRenderTime };
}

export default useLogs;
