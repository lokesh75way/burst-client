import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getImageUrl } from "../../helpers/commonFunction";

const ReceivedButton = ({ pendingInvitations }) => {
    const navigation = useNavigation();
    const navigateUser = () => {
        navigation.navigate("Invitations");
    };
    const [inviteA, inviteB] = pendingInvitations;

    return (
        <TouchableOpacity onPress={navigateUser} style={styles.receivedButton}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: getImageUrl(inviteB?.invitedBy.profileImageKey),
                    }}
                    style={[styles.image, styles.image1]}
                />
                <Image
                    source={{
                        uri: getImageUrl(inviteA?.invitedBy.profileImageKey),
                    }}
                    style={[styles.image, styles.image2]}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.boldText}>Join Teams</Text>
                <Text style={styles.thinText}>
                    Accept team requests to help decide whether these users'
                    posts should burst out.
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ReceivedButton;

const styles = StyleSheet.create({
    receivedButton: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#00000030",
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
        height: 90,
    },
    imageContainer: {
        position: "relative",
        height: "100%",
        width: "20%",
        marginLeft: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 5,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 35,
        position: "absolute",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#fff",
    },
    singleImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    image1: {
        top: 0,
        left: 0,
    },
    image2: {
        top: 15,
        left: 15,
    },
    boldText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    thinText: {
        fontSize: 18,
        fontWeight: "400",
        color: "#000",
    },
});
