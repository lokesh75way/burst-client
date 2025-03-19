import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Divider } from "react-native-elements";

import RBSheet from "react-native-raw-bottom-sheet";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import Button from "../Button";
import { ChannelIcon, CheckBoxIcon, ExcludeIcon } from "../Svgs";

const SuggestChannelsModal = ({
    showSuggestChannelsModal,
    setShowSuggestChannelsModal,
    onConfirm,
    initialSuggestedChannels,
    initialExcludedChannels,
    excluedNotJoined,
    setExcludeNotJoined,
    isCanceled,
    resetCancel,
    sheetRef,
}) => {
    const [myChannels, setMyChannels] = useState([]);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [excludedChannels, setExcludedChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userJoinedChannels } = useApp();

    useEffect(() => {
        if (isCanceled) {
            setSelectedChannels([]);
            setExcludedChannels([]);
            setExcludeNotJoined(false);
            resetCancel();
        } else {
            setSelectedChannels(initialSuggestedChannels);
            setExcludedChannels(initialExcludedChannels);
        }
    }, [initialSuggestedChannels, initialExcludedChannels, isCanceled]);

    const getUserChannels = async () => {
        try {
            setIsLoading(true);
            setMyChannels(userJoinedChannels);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserChannels();
    }, []);

    const handleCheckboxChange = (channel, isSuggested) => {
        if (isSuggested) {
            setSelectedChannels((prevSelectedChannels) => {
                const isChannelSelected = prevSelectedChannels.some(
                    (ch) => ch.id === channel.id,
                );
                if (isChannelSelected) {
                    return prevSelectedChannels.filter(
                        (ch) => ch.id !== channel.id,
                    );
                } else {
                    return [...prevSelectedChannels, channel];
                }
            });
            setExcludedChannels((prevExcludedChannels) =>
                prevExcludedChannels.filter((ch) => ch.id !== channel.id),
            );
        } else {
            setExcludedChannels((prevExcludedChannels) => {
                const isChannelSelected = prevExcludedChannels.some(
                    (ch) => ch.id === channel.id,
                );
                if (isChannelSelected) {
                    return prevExcludedChannels.filter(
                        (ch) => ch.id !== channel.id,
                    );
                } else {
                    return [...prevExcludedChannels, channel];
                }
            });
            setSelectedChannels((prevSelectedChannels) =>
                prevSelectedChannels.filter((ch) => ch.id !== channel.id),
            );
        }
    };

    const handleConfirm = () => {
        sheetRef.current.close();
        onConfirm(selectedChannels, excludedChannels, excluedNotJoined);
    };

    useEffect(() => {
        if (showSuggestChannelsModal) {
            sheetRef?.current?.open();
        }
    }, [showSuggestChannelsModal]);

    return (
        <RBSheet
            ref={sheetRef}
            openDuration={300}
            height={Dimensions.get("screen").height * 0.75}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => {
                setShowSuggestChannelsModal(false);
            }}
            draggable
        >
            <View style={styles.modalHeader}>
                <ChannelIcon />
                <Text style={styles.titleText}>
                    Suggest Channels to Your Team
                </Text>
            </View>
            <Text style={{ paddingVertical: 10, fontSize: 16 }}>
                Suggest Channels for Your Team to Burst your post into.
            </Text>
            {myChannels.length === 0 && !isLoading && (
                <View style={styles.noResultContainer}>
                    <Text style={styles.noResultText}>
                        No Channels to Suggest
                    </Text>
                    <Text style={styles.noResultText}>Create or Join one</Text>
                </View>
            )}
            {/* Suggested Channels */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading && (
                    <ActivityIndicator color={theme.colors.lightBlue} />
                )}
                {!isLoading && (
                    <View>
                        {myChannels.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange(item, true)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        selectedChannels.some(
                                            (ch) => ch.id === item.id,
                                        ) && styles.checked,
                                    ]}
                                >
                                    {selectedChannels.some(
                                        (ch) => ch.id === item.id,
                                    ) && <CheckBoxIcon />}
                                </View>
                                <Text
                                    style={[
                                        styles.checkboxLabel,
                                        excludedChannels.some(
                                            (ch) => ch.id === item.id,
                                        ) && styles.strikethrough,
                                    ]}
                                >
                                    {item.type === "private" && (
                                        <>
                                            <FontAwesome5
                                                name="lock"
                                                size={14}
                                                color={theme.colors.lightBlue}
                                            />{" "}
                                        </>
                                    )}
                                    {item.tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Divider />
            <View
                style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    alignItems: "center",
                }}
            >
                <ExcludeIcon />
                <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
                    Prevent this post from Bursting to:
                </Text>
            </View>
            {/* Excluded Channels */}

            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading && (
                    <ActivityIndicator color={theme.colors.lightBlue} />
                )}
                {!isLoading && (
                    <View>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setExcludeNotJoined(!excluedNotJoined);
                            }}
                        >
                            <View
                                style={[
                                    {
                                        ...styles.checkbox,
                                        borderColor: "#666",
                                    },
                                    excluedNotJoined && styles.checked,
                                ]}
                            >
                                {excluedNotJoined && (
                                    <CheckBoxIcon fill="#666" />
                                )}
                            </View>
                            <Text
                                style={[
                                    {
                                        ...styles.checkboxLabel,
                                        color: "#666",
                                    },
                                ]}
                            >
                                All channels that i'm not in
                            </Text>
                        </TouchableOpacity>
                        {myChannels.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.checkboxContainer}
                                onPress={() =>
                                    handleCheckboxChange(item, false)
                                }
                            >
                                <View
                                    style={[
                                        {
                                            ...styles.checkbox,
                                            borderColor: "#666",
                                        },
                                        excludedChannels.some(
                                            (ch) => ch.id === item.id,
                                        ) && styles.checked,
                                    ]}
                                >
                                    {excludedChannels.some(
                                        (ch) => ch.id === item.id,
                                    ) && <CheckBoxIcon fill="#666" />}
                                </View>
                                <Text
                                    style={[
                                        {
                                            ...styles.checkboxLabel,
                                            color: "#666",
                                        },
                                        selectedChannels.some(
                                            (ch) => ch.id === item.id,
                                        ) && styles.strikethrough,
                                    ]}
                                >
                                    {item.type === "private" && (
                                        <>
                                            <FontAwesome5
                                                name="lock"
                                                size={14}
                                                color="#aaa"
                                            />{" "}
                                        </>
                                    )}
                                    {item.tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Button label="Confirm" onPress={handleConfirm} />
        </RBSheet>
    );
};

export default SuggestChannelsModal;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingBottom: 20,
    },
    outerContainer: {
        height: "100%",
        backgroundColor: "#00000080",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        alignSelf: "center",
        paddingHorizontal: 30,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "700",
        marginHorizontal: 10,
        alignSelf: "center",
        textAlign: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: theme.colors.lightBlue,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checked: {
        backgroundColor: "#fff",
        borderWidth: 0,
    },
    checkboxLabel: {
        fontSize: 18,
        fontWeight: "500",
        color: theme.colors.lightBlue,
    },
    strikethrough: {
        textDecorationLine: "line-through",
        color: "#aaa",
    },
    noResultText: {
        fontSize: 18,
        color: "#aaa",
    },
    noResultContainer: {
        alignSelf: "center",
        padding: 20,
        alignItems: "center",
    },
});
