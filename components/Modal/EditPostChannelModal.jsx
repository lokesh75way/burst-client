import React, { useRef, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import ConfirmPostRemoveModal from "./ConfirmPostRemoveModal";

const EditPostChannelModal = ({
    setShowEditPostChannelModal,
    burstedChannels,
    setBurstedChannels,
    postId,
    onRefresh,
    currentChannel,
    removePost,
    sheetRef,
}) => {
    const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState({});
    const { removePostFromChannel } = usePosts();
    const confirmModalSheetRef = useRef();
    const { setReloadProfile } = useApp();

    const handleRemovePress = () => {
        setShowConfirmRemoveModal(true);
    };

    const handleConfirmRemove = async () => {
        console.log(postId);
        console.log(selectedChannel);
        await removePostFromChannel(postId, selectedChannel.id);
        setBurstedChannels((prevChannels) =>
            prevChannels.filter((channel) => channel.id !== selectedChannel.id),
        );
        // setShowConfirmRemoveModal(false);
        // setShowEditPostChannelModal(false);
        confirmModalSheetRef?.current?.close();
        setReloadProfile(true);
        if (burstedChannels.length <= 1) {
            sheetRef?.current.close();
        }
        // onRefresh();
        if (currentChannel > 0 && currentChannel === selectedChannel.id) {
            removePost(postId);
        }
    };
    return (
        <RBSheet
            ref={sheetRef}
            height={
                burstedChannels.length === 0
                    ? Dimensions.get("screen").height * 0.25
                    : Dimensions.get("screen").height * 0.5
            }
            openDuration={350}
            customStyles={{ container: styles.modalContainer }}
            draggable
        >
            <View>
                <View style={styles.modalHeader}>
                    <Text style={styles.titleText}>Edit Post Channels</Text>
                </View>
                {burstedChannels.length === 0 && (
                    <Text
                        style={{
                            padding: 30,
                            textAlign: "center",
                            color: "#B6B6B6",
                            fontSize: 16,
                        }}
                    >
                        This post hasn't been bursted into any channel yet.
                    </Text>
                )}
                {burstedChannels.length > 0 && (
                    <ScrollView
                        style={{ marginVertical: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {burstedChannels &&
                            burstedChannels.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginVertical: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "50%",
                                            paddingRight: 10,
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: 18,
                                                color: theme.colors.lightBlue,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.tag}
                                        </Text>
                                        <Text
                                            style={{
                                                color: "#ccc",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.membersCount}{" "}
                                            {item.membersCount > 1
                                                ? "Members"
                                                : "Member"}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingVertical: 5,
                                            borderWidth: 2,
                                            borderColor: theme.colors.lightBlue,
                                            borderRadius: 16,
                                            alignItems: "center",
                                            width: "50%",
                                        }}
                                        onPress={() => {
                                            console.log(item);
                                            setSelectedChannel(item);
                                            // handleRemovePress();
                                            confirmModalSheetRef.current?.open();
                                        }}
                                        testID="remove-from-channel-button"
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: theme.colors.lightBlue,
                                                fontWeight: "500",
                                            }}
                                        >
                                            Remove from
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 16,
                                                color: theme.colors.lightBlue,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.tag}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </ScrollView>
                )}
                <ConfirmPostRemoveModal
                    visible={showConfirmRemoveModal}
                    channelData={selectedChannel}
                    onClose={() => {
                        confirmModalSheetRef.current?.close();
                    }}
                    onConfirm={handleConfirmRemove}
                    postId={postId}
                    sheetRef={confirmModalSheetRef}
                />
            </View>
        </RBSheet>
    );
};

export default EditPostChannelModal;

const styles = StyleSheet.create({
    modalContainer: {
        zIndex: 2,
        backgroundColor: "#fff",
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    titleText: {
        fontSize: 24,
        fontWeight: "700",
        marginHorizontal: 10,
    },
});
