import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { InvitationStatus } from "../../config/data";
import theme from "../../config/theme";
import useInvitation from "../../hooks/useInvitation";
import Button from "../Button";
import AuthorImage from "../FeedPost/AuthorImage";
import ConfirmationModal from "../Modal";

const UserItem = ({
    invitedTo,
    source,
    username,
    inviteId,
    onPress,
    displayName,
    isOnboarding = false,
    ...rest
}) => {
    const { updateInvitation } = useInvitation();
    const [showModal, setShowModal] = useState(false);
    const [userRemoved, setUserRemoved] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const removeUser = async () => {
        try {
            await updateInvitation(inviteId, InvitationStatus.LEAVE);
            setUserRemoved(true);
            setShowModal(false);
            showMessage({
                message: "User removed from your team",
                type: "success",
            });
        } catch (err) {
            showMessage({
                message: "Failed to remove user",
                type: "danger",
            });
        }
    };

    const getMessage = () => (
        <Text style={styles.msgText}>
            We won’t tell
            <Text style={{ fontWeight: "bold" }}> {username}</Text> they were
            removed from your team
        </Text>
    );

    if (userRemoved) {
        return null;
    }

    return (
        <>
            <View style={styles.userItem}>
                <View style={styles.user}>
                    <AuthorImage
                        size={45}
                        isERT={false}
                        imageUrl={source}
                        author={invitedTo}
                        disabled={isOnboarding}
                        fromTeam
                    />
                    <View style={{ width: "100%" }}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.userText}
                        >
                            {displayName}
                        </Text>
                        <Text style={{ color: theme.colors.grey }}>
                            @{username}
                        </Text>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <Button
                        label={rest.label}
                        borderRadius={rest.borderRadius ?? 20}
                        bgColor={rest.bgColor}
                        color={rest.color}
                        marginTop={rest.marginTop ?? 10}
                        onPress={onPress ?? openModal}
                        {...rest}
                    />
                </View>
            </View>
            {showModal && (
                <ConfirmationModal
                    visible={showModal}
                    onPress={removeUser}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    source={source}
                    label={`Remove ${username}?`}
                    message={getMessage()}
                />
            )}
        </>
    );
};

export default UserItem;

const styles = StyleSheet.create({
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        width: "65%",
    },
    userText: {
        fontSize: 18,
        color: "#202020",
        fontWeight: "600",
        width: "65%",
    },
    btnContainer: {
        width: "30%",
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    msgText: {
        fontSize: 18,
        color: "#959696",
        fontWeight: "600",
        textAlign: "center",
    },
});
