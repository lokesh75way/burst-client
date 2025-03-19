import { useIsFocused, useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import mailIcon from "../assets/icons/mail.png";
import InvitationList from "../components/InvitationList";
import { ArrowLeftSVG, CrossSVG } from "../components/Svgs";
const Invitations = ({ route }) => {
    const { navigate } = useNavigation();
    const [showMail, setShowMail] = useState(true);
    const isFocused = useIsFocused();
    const goBack = () => {
        if (route.params?.isProfile) {
            navigate("Profile");
        } else {
            navigate("Notification");
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <ArrowLeftSVG />
                </TouchableOpacity>
                <Text style={styles.title}>Join Teams</Text>
                <View style={{ width: 50 }} />
            </View>
            <View style={{ marginHorizontal: 20 }}>
                {showMail && (
                    <View style={styles.mailContainer}>
                        <Image source={mailIcon} style={styles.mailIcon} />
                        <Text style={styles.mailText}>
                            Accept team requests to help decide whether these
                            users' posts should burst out.
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setShowMail(false);
                            }}
                            style={styles.crossIcon}
                        >
                            <CrossSVG />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <InvitationList isFocused={isFocused} />
        </SafeAreaView>
    );
};

export default Invitations;

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        color: "#000",
    },
    screenHeader: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 0,
    },
    backButton: {
        width: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    mailContainer: {
        backgroundColor: "#C0C0C030",
        width: "100%",
        borderRadius: 10,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        marginVertical: 20,
    },
    mailIcon: {
        height: 70,
        width: 70,
    },
    mailText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "400",
        width: "80%",
    },
    crossIcon: {
        position: "absolute",
        right: 12,
        top: 12,
    },
    icon: {
        height: 10,
    },
});
