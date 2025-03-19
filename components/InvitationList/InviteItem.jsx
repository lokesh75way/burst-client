import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { defaultAvatar, picturePrefix } from "../../config/constants";
import { InvitationStatus } from "../../config/data";
import theme from "../../config/theme";
import Button from "../Button";
const InviteItem = ({ data, handleInvitation }) => {
    const { invitedBy, id, invitedTo } = data;
    const { userName, profileImageKey } = invitedBy;

    const [accepted, setAccepted] = useState(data.status === "accepted");

    const imageUrl = profileImageKey
        ? picturePrefix + profileImageKey
        : picturePrefix + defaultAvatar;

    return (
        <View style={styles.inviteItem}>
            <View style={styles.userContainer}>
                <Image source={{ uri: imageUrl }} style={styles.media} />
                <View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.userName}
                    >
                        {userName}'s Team
                    </Text>
                    <View style={styles.btnContainer}>
                        <View style={styles.btn}>
                            <Button
                                label={accepted ? "Joined" : "Accept"}
                                variant={accepted ? "outlined" : "contained"}
                                color={
                                    accepted
                                        ? theme.colors.lightBlue
                                        : theme.colors.white
                                }
                                outlinedColor={theme.colors.lightBlue}
                                onPress={() => {
                                    if (!accepted) {
                                        handleInvitation(
                                            id,
                                            InvitationStatus.ACCEPTED,
                                        );
                                        setAccepted(true);
                                    }
                                }}
                                borderRadius={20}
                                disabled={accepted}
                            />
                        </View>
                        <View style={styles.btn}>
                            <Button
                                label={accepted ? "Leave" : "Ignore"}
                                variant="contained"
                                color={theme.colors.white}
                                bgColor="#A1A0A0"
                                outlinedColor="#A1A0A0"
                                onPress={() => {
                                    if (accepted) {
                                        Alert.alert(
                                            "Leave Team",
                                            `Are you sure, you want to leave ${userName}'s team?`,
                                            [
                                                {
                                                    text: "Cancel",
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Confirm",
                                                    onPress: () => {
                                                        handleInvitation(
                                                            invitedBy.id,
                                                            InvitationStatus.LEAVE,
                                                        );
                                                    },
                                                    style: "destructive",
                                                },
                                            ],
                                        );
                                    } else {
                                        handleInvitation(
                                            invitedBy.id,
                                            InvitationStatus.IGNORED,
                                        );
                                    }
                                }}
                                borderRadius={20}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default InviteItem;

const styles = StyleSheet.create({
    inviteItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginVertical: 10,
    },
    media: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
    },
    userName: {
        fontSize: 16,
        color: "#000",
        fontWeight: "600",
        width: "100%",
        padding: 5,
    },
    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        overflow: "hidden",
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        // justifyContent: "space-between",
        gap: 10,
        width: "90%",
    },
    btn: {
        width: "45%",
    },
});
