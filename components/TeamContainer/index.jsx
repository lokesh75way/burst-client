import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useInvitation from "../../hooks/useInvitation";
import Loader from "../Loader";
import UserItem from "../UserItem";

const TeamContainer = ({ isFocused }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getYourTeam } = useInvitation();

    const getTeamMembers = async () => {
        try {
            const data = await getYourTeam();
            setTeamMembers(data);
        } catch (err) {
            console.log("error, ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeamMembers();
    }, [isFocused]);

    if (loading) {
        return <Loader size="medium" color="skyblue" />;
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.teamContainer}
        >
            {teamMembers.length > 0 &&
                teamMembers.map((user) => {
                    const { userName, profileImageKey, displayName } =
                        user.invitedTo;
                    return (
                        <UserItem
                            key={user.id}
                            invitedTo={user.invitedTo}
                            source={getImageUrl(profileImageKey)}
                            username={userName}
                            inviteId={user.id}
                            label="Added"
                            variant="outlined"
                            color={theme.colors.lightBlue}
                            displayName={displayName}
                        />
                    );
                })}
            {teamMembers.length == 0 && (
                <View style={{ width: "100%" }}>
                    <Text style={{ textAlign: "center" }}>
                        No users in your team
                    </Text>
                </View>
            )}
            <View style={{ height: 150 }} />
        </ScrollView>
    );
};

export default TeamContainer;

const styles = StyleSheet.create({
    teamContainer: {
        height: "100%",
        marginTop: 20,
    },
});
