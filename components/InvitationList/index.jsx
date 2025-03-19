import React, { useEffect, useState, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { InvitationStatus } from "../../config/data";
import useInvitation from "../../hooks/useInvitation";
import Loader from "../Loader";
import InviteItem from "./InviteItem";

const InvitationList = ({ isFocused }) => {
    const { getInvitations, updateInvitation, revertInvitation } =
        useInvitation();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const scrollViewRef = useRef(null);

    const getYourInvitations = async () => {
        try {
            const data = await getInvitations();
            setInvitations(data);
        } catch (err) {
            console.log("error, ", err);
        } finally {
            setLoading(false);
        }
    };
    const handleInvitation = async (invitationId, action) => {
        if (
            action == InvitationStatus.IGNORED ||
            action == InvitationStatus.LEAVE
        ) {
            setInvitations((prev) =>
                prev.filter((invite) => invite.id !== invitationId),
            );
            await revertInvitation(invitationId);
        } else {
            await updateInvitation(invitationId, action);
        }
        setUpdate(!update);
    };

    useEffect(() => {    
        getYourInvitations();
    }, [isFocused, update]);

    useEffect(() => {
        if (isFocused && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [isFocused]);


    if (loading) {
        return <Loader size="medium" color="skyblue" />;
    }

    return (
        <ScrollView
        ref={scrollViewRef}
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {invitations.length > 0 &&
                invitations.map((invite) => (
                    <InviteItem
                        key={invite.id}
                        data={invite}
                        handleInvitation={handleInvitation}
                    />
                ))}
        </ScrollView>
    );
};

export default InvitationList;

const styles = StyleSheet.create({
    container: {
        marginBottom: 70,
        marginHorizontal: 20,
    },
});
