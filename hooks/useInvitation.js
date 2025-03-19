import useApp from "./useApp";

function useInvitation() {
    const { api } = useApp();

    const getYourTeam = async () => {
        const { data } = await api.get("/invitations/team");
        return data;
    };

    const postInvitation = async (inviteeId) => {
        const { data } = await api.post("/invitations/", { inviteeId });
        return data;
    };

    const getInvitation = async (inviteeId) => {
        const { data } = await api.get("/invitations/", { inviteeId });
        return data;
    };

    const getInvitations = async () => {
        const { data } = await api.get("/invitations/");
        return data;
    };

    const getMyInviter = async () => {
        const { data } = await api.get("/invitations/my-inviter");
        return data;
    };

    const postEmailInvitation = async (inviteeEmail) => {
        const { data } = await api.post("/invitations/email-invite", {
            inviteeEmail,
        });
        return data;
    };

    const updateInvitation = async (invitationId, status) => {
        const { data } = await api.put(`/invitations/${invitationId}`, {
            status,
        });
        return data;
    };

    const revertInvitation = async (inviteeId) => {
        const { data } = await api.delete(`/invitations/${inviteeId}`, {
            inviteeId,
        });
        return data;
    };

    return {
        getYourTeam,
        updateInvitation,
        postInvitation,
        postEmailInvitation,
        getInvitations,
        getInvitation,
        revertInvitation,
        getMyInviter,
    };
}

export default useInvitation;
