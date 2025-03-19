import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";

const InviteMoreModal = ({ sheetRef }) => {
    const { setActiveRoute } = useApp();
    const navigation = useNavigation();
    return (
        // <Modal animationType="slide" transparent>
        //     <TouchableWithoutFeedback
        //         onPress={() => {
        //             setShowInviteMoreModal(false);
        //         }}
        //     >
        //         <View style={styles.outerContainer} />
        //     </TouchableWithoutFeedback>

        // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <RBSheet
            ref={sheetRef}
            height={270}
            openDuration={300}
            customStyles={{
                container: [styles.modalContainer],
            }}
            closeOnPressBack
            closeOnPressMask
            onClose={async () => {
                await AsyncStorage.setItem("inviteMoreSheetShown", "true");
            }}
        >
            {/* <View style={{ ...styles.modalContainer, height: 300 }}> */}
            <View style={styles.modalHeader}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    You have
                    <Text style={{ fontWeight: "800" }}>
                        {" "}
                        fewer than three people{" "}
                    </Text>
                    on your team. There may not be enough people around on your
                    team to burst your posts.
                </Text>
            </View>
            <View style={styles.btnBar}>
                <Button
                    title={"Dismiss"}
                    buttonStyle={styles.dismissButton}
                    titleStyle={{ color: theme.colors.lightBlue }}
                    onPress={() => {
                        sheetRef?.current.close();
                    }}
                />
                <Button
                    title={"Invite more people"}
                    buttonStyle={styles.inviteButton}
                    titleStyle={{ color: theme.colors.white }}
                    onPress={() => {
                        sheetRef?.current.close();
                        setActiveRoute("YourTeam");
                        navigation.navigate("YourTeam");
                    }}
                />
            </View>
            {/* </View> */}
        </RBSheet>
        //     </TouchableWithoutFeedback>
        // </Modal>
    );
};

export default InviteMoreModal;

const styles = StyleSheet.create({
    modalContainer: {
        // position: "absolute",
        // width: "100%",
        // bottom: "0%",
        // zIndex: 2,
        backgroundColor: "#fff",
        padding: 20,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    outerContainer: { height: "100%", backgroundColor: "#00000080" },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        padding: 20,
    },
    btnBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
    },
    dismissButton: {
        backgroundColor: "white",
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        width: Dimensions.get("screen").width * 0.32,
    },
    inviteButton: {
        backgroundColor: theme.colors.lightBlue,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        width: Dimensions.get("screen").width * 0.55,
    },
});
