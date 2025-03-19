import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Renders the Privacy component.
 * This component displays the privacy policy of the Burst application.
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @returns {JSX.Element} React component for displaying the privacy policy.
 */
const Privacy = ({ navigation }) => {
    // navigate to login page
    /**
     * Navigates to the SignUp page.
     * @function goToSignUp
     * @returns {void}
     */
    const goToSignUp = () => {
        navigation.navigate("SignUp");
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.textCurio}>Burst</Text>
                <Text>PRIVACY POLICY{"\n"}</Text>
                <ScrollView key="research" style={styles.research}>
                    <Text>
                        This privacy policy governs the Burst application, a
                        Stanford University research project.{"\n"}
                    </Text>
                    <Text>DATA WE STORE{"\n"}</Text>
                    <Text>
                        Any data that you upload and/or create is stored
                        securely on our servers, including but not limited to
                        email, display name, post content, images, and
                        interactions with posts (such as comments, bursts, and
                        reactions). We collect minimum amount of metadata, such
                        as timestamps. We do not collect IP addresses at the
                        moment.{"\n"}
                    </Text>
                    <Text>DATA RETENTION PERIOD{"\n"}</Text>
                    <Text>
                        Data is stored until the user requests a deletion or
                        until the legal retention period expires, if applicable.
                        {"\n"}
                    </Text>
                    <Text>REQUEST ACCOUNT DELETION{"\n"}</Text>
                    <Text>
                        As a user of this platform, you have the right to
                        request that your account be deleted. If you would like
                        to do so, please email curio@cs.stanford.edu with the
                        subject line "Account deletion request". We will respond
                        to your request within 14 days and promptly destroy all
                        data associated with your account.{"\n"}
                    </Text>
                </ScrollView>
                <View style={styles.buttonLogin}>
                    <Button title="Accept" onPress={goToSignUp} />
                </View>

                <View style={styles.line} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "start",
        alignItems: "center",
        marginVertical: "25%",
        // padding: "%",
    },

    research: {
        width: "80%",
    },

    textCurio: {
        fontSize: 100,
        // fontFamily: 'Helvetica',
        bottom: "5%",
        color: "#268EC8",
    },

    line: {
        height: 1,
        backgroundColor: "lightgray",
        width: "100%",
        bottom: "3%",
    },
    buttonLogin: {
        bottom: "3%",
        top: "5%",
    },
});

export default Privacy;
