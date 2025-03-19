import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";

import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import AddIcon from "../Svgs/AddIcon";
import PrivateChannelIcon from "../Svgs/PrivateChannelIcon";

const ChannelBar = ({
    channels,
    setChannels,
    currentChannel,
    setCurrentChannel,
    showChannelScreen,
    setShowChannelsScreen,
    refreshBar,
}) => {
    const { setReloadProfile } = useApp();
    const scrollViewRef = useRef(null);
    const channelRefs = useRef({});

    useEffect(() => {
        if (showChannelScreen || !scrollViewRef.current) {
            return;
        }

        const channelRef = channelRefs.current[currentChannel];
        if (channelRef) {
            channelRef.measureLayout(
                scrollViewRef.current,
                (x) => {
                    scrollViewRef.current.scrollTo({
                        x: Math.max(x - 50, 0),
                        animated: true,
                    });
                },
                () =>
                    console.error(
                        "Failed to measure layout for channel ref",
                        currentChannel,
                    ),
            );
        }
    }, [currentChannel, showChannelScreen]);

    // const getAllChannels = async () => {
    //     try {
    //         const data = await getMyChannels();
    //         const userChannels = data.userPublicChannels;
    //         const joinedChannels = data.joinedPublicChannels;
    //         const userPrivateChannels = data.userPrivateChannels;
    //         const joinedPrivateChannels = data.joinedPrivateChannels;
    //         // console.log("userChannels: ", userChannels);
    //         // console.log("joinedChannels: ", joinedChannels);
    //         setChannels([
    //             ...userChannels,
    //             ...userPrivateChannels,
    //             ...joinedPrivateChannels,
    //             ...joinedChannels,
    //         ]);
    //     } catch (err) {
    //         console.log("Error in fetching channels", err);
    //     }
    // };

    const addChannel = (id) => {
        console.log("called:-");
        setShowChannelsScreen(false);
        setCurrentChannel(id);
    };

    // useEffect(() => {
    //     getAllChannels();
    //     if (refreshBar) {
    //         getAllChannels();
    //         setReloadProfile(true);
    //     }
    // }, [refreshBar]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         getAllChannels();
    //     }, []),
    // );

    const everyoneChannel = channels.find(
        (channel) => channel.tag === "#everyone",
    );
    const otherChannels = channels.filter(
        (channel) => channel.tag !== "#everyone",
    );
    // const publicChannels = channels.filter(
    //     (channel) => channel.tag !== "#everyone" && channel.type === "public",
    // );
    // const privateChannels = channels.filter(
    //     (channel) => channel.tag !== "#everyone" && channel.type === "private",
    // );

    const data = [
        { id: 0, tag: "All Feeds", type: "public" },
        ...(everyoneChannel ? [everyoneChannel] : []),
        ...otherChannels,
        // ...privateChannels,
        // ...publicChannels,
    ];

    return (
        <View>
            <ScrollView
                horizontal
                style={styles.wrapper}
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
            >
                <View style={styles.container}>
                    {data.map((channel, index) => {
                        const { id, tag } = channel || {};
                        const isActive = currentChannel === id;
                        const viewStyle =
                            isActive && !showChannelScreen
                                ? styles.selected
                                : {};
                        const textStyle =
                            isActive && !showChannelScreen
                                ? styles.lightText
                                : {};
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    addChannel(id);
                                }}
                                style={[styles.channel, viewStyle]}
                                ref={(ref) => (channelRefs.current[id] = ref)}
                                testID="channel-bar-chip"
                            >
                                {channel.type === "private" ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <PrivateChannelIcon
                                            color={
                                                textStyle.color ||
                                                styles.text.color
                                            }
                                        />
                                        <Text style={[styles.text, textStyle]}>
                                            {tag}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={[styles.text, textStyle]}>
                                        {tag}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setShowChannelsScreen(true);
                    }}
                    style={[
                        styles.channel,
                        showChannelScreen && styles.selected,
                        {
                            marginLeft: 10,
                            paddingHorizontal: 6,
                            marginRight: 30,
                        },
                    ]}
                    testID="channels"
                >
                    <AddIcon stroke={showChannelScreen ? "#fff" : "#479ae2"} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ChannelBar;

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 8,
    },
    channel: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme.colors.lightBlue,
        paddingHorizontal: 14,
        paddingVertical: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: theme.colors.lightBlue,
        fontSize: 16,
        fontWeight: "600",
    },
    selected: {
        // backgroundColor: theme.colors.lightBlue,
        backgroundColor: "#479ae2",
    },
    lightText: {
        color: "#fff",
    },
});
