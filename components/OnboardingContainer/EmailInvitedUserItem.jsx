import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { defaultAvatar, picturePrefix } from "../../config/constants";
import theme from "../../config/theme";

const EmailInvitedUserItem = ({ email }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={styles.infoWrapper}>
                <Image
                    height={45}
                    width={45}
                    source={{
                        uri: `${picturePrefix}${defaultAvatar}`,
                    }}
                    style={styles.image}
                />
                <Text style={styles.emailText} numberOfLines={1}>
                    {email}
                </Text>
            </View>
            <View style={styles.inviteByuButton}>
                <Text style={styles.inviteByText}>Invited By Email</Text>
            </View>
        </View>
    );
};

export default EmailInvitedUserItem;

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        width: "60%",
    },
    image: {
        height: 45,
        width: 45,
        borderRadius: 45,
    },
    emailText: {
        fontSize: 16,
        width: "70%",
        fontWeight: "500",
    },
    inviteByuButton: {
        backgroundColor: theme.colors.green,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
    },
    inviteByText: {
        color: theme.colors.white,
    },
});
