import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import theme from "../../config/theme";
import useChannels from "../../hooks/useChannels";

const JoinAndBurstChannelModal = ({
    showBurstToChannelModal,
    setShowBurstToChannelModal,
    channelData,
    onClose,
    onConfirm,
    sheetRef,
}) => {
    const navigation = useNavigation();
    const { addRemoveUser } = useChannels();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (showBurstToChannelModal) {
            sheetRef?.current?.open();
        }
    }, [showBurstToChannelModal]);

    return (
        <RBSheet
            ref={sheetRef}
            openDuration={350}
            closeDuration={350}
            draggable
            dragOnContent
            height={Dimensions.get("screen").height * 0.5}
            customStyles={{ container: styles.modalContainer }}
            onClose={onClose}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                    width: Dimensions.get("screen").width,
                }}
            >
                <Text style={styles.confirmMessageText}>
                    You haven't joined
                    <Text style={[styles.channelName]}>
                        {` ${channelData.tag} `}
                    </Text>
                    yet, So you are unable to Burst to this channel. Would you
                    like to join now?
                </Text>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                        onClose();
                        navigation.navigate("ChannelDetails", {
                            channelId: channelData.id,
                            channelTag: channelData.tag,
                            isJoined: false,
                        });
                    }}
                >
                    <Text style={styles.confirmButtonText}>View Channel</Text>
                </TouchableOpacity>
                <View style={styles.confirmButtonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={async () => {
                            try {
                                setIsLoading(true);
                                await addRemoveUser(channelData.id, {
                                    type: "add",
                                });
                                DeviceEventEmitter.emit("getChannels");
                                onConfirm();
                                // onClose();
                            } catch (error) {
                                console.log(error);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                    >
                        {!isLoading && (
                            <Text style={styles.confirmButtonText}>
                                Join and Burst
                            </Text>
                        )}
                        {isLoading && (
                            <ActivityIndicator color={theme.colors.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        height: "100%",
        backgroundColor: "#00000080",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        alignItems: "center",
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    channelName: {
        color: theme.colors.lightBlue,
        textAlign: "center",

        // marginBottom: 30,
    },
    confirmMessageText: {
        fontSize: 26,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    confirmButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
    },
    confirmButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: theme.colors.lightBlue,
        borderRadius: 10,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    cancelButtonText: {
        color: theme.colors.lightBlue,
        fontSize: 18,
    },
    viewButton: {
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: theme.colors.lightBlue,
        borderRadius: 10,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
});

export default JoinAndBurstChannelModal;
