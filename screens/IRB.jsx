import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Renders the IRB (Institutional Review Board) component.
 * This component displays information about a research study and allows the user to accept it.
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @returns {JSX.Element} React component for displaying research study information.
 */
const IRB = ({ navigation }) => {
    // navigate to login page

    /**
     * Navigates to the Privacy page.
     * @function goToPrivacy
     * @returns {void}
     */
    const goToPrivacy = () => {
        navigation.navigate("Privacy");
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.textCurio}>Burst</Text>
                <Text>
                    Stanford University Research Information Sheet{"\n"}
                </Text>
                <ScrollView key="research" style={styles.research}>
                    <Text>
                        {"\n"}Protocol director: Michael Bernstein{"\n"}
                    </Text>
                    <Text>IRB approval date: 5/16/2022{"\n"}</Text>
                    <Text>Expiration date: (does not expire){"\n"}</Text>
                    <Text>
                        DESCRIPTION: You are invited to participate in a
                        research study on the design of social media platforms.
                        You will be asked to use this social media platform as
                        per your interests and desires.{"\n"}
                    </Text>
                    <Text>
                        TIME INVOLVEMENT: Your participation will take as little
                        or as much time as you choose to spend on this platform.{" "}
                        {"\n"}
                    </Text>
                    <Text>
                        RISKS AND BENEFITS: While we strive to create lower
                        risks with this project, the risks associated with this
                        study are similar in nature to those using other social
                        media. The platform will collect data required for its
                        operation and for analysis in scientific publications,
                        including the content that you share, the people or
                        groups that you are conntected to, and your reactions to
                        content on the platform. Study data will be stored
                        securely, in compliance with Stanford University
                        standards, minimizing the risk of confidentiality
                        breach. The benefits which may reasonably be expected to
                        result from this study are similar in nature to using
                        other social media. We cannot and do not guarantee or
                        promise that you will receive any benefits from this
                        study.{"\n"}
                    </Text>
                    <Text>PAYMENTS: This is not a paid study.{"\n"}</Text>
                    <Text>
                        AGE: In accordance with United States COPPA rules, you
                        may only use this platform if you are 13 years of age or
                        older.{"\n"}
                    </Text>
                    <Text>
                        PARTICIPANT’S RIGHTS: If you have read this form and
                        have decided to participate in this project, please
                        understand your participation is voluntary and you have
                        the right to withdraw your consent or discontinue
                        participation at any time without penalty or loss of
                        benefits to which you are otherwise entitled. The
                        alternative is not to use this platform. You have the
                        right to refuse to answer particular questions. The
                        results of this research study may be presented at
                        scientific or professional meetings or published in
                        scientific journals. Your individual privacy will be
                        maintained in all published and written data resulting
                        from the study.{"\n"}
                    </Text>
                    <Text>
                        In accordance with scientific norms, the data from this
                        study may be used or shared with other researchers for
                        future research (after removing personally identifying
                        information) without additional consent from you.{"\n"}
                    </Text>
                    <Text>CONTACT INFORMATION:{"\n"}</Text>
                    <Text>
                        Questions: If you have any questions, concerns or
                        complaints about this research, its procedures, risks
                        and benefits, contact the Protocol Director, Michael
                        Bernstein 650-724-1248.{"\n"}
                    </Text>
                    <Text>
                        Independent Contact: If you are not satisfied with how
                        this study is being conducted, or if you have any
                        concerns, complaints, or general questions about the
                        research or your rights as a participant, please contact
                        the Stanford Institutional Review Board (IRB) to speak
                        to someone independent of the research team at
                        (650)-723-2480 or toll free at 1-866-680-2906, or email
                        at irbnonmed@stanford.edu. You can also write to the
                        Stanford IRB, Stanford University, 1705 El Camino Real,
                        Palo Alto, CA 94306.{"\n"}
                    </Text>
                </ScrollView>
                <View style={styles.buttonLogin}>
                    <Button title="Accept" onPress={goToPrivacy} />
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

export default IRB;
