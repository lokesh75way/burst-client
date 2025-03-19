import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import ReactSVG from "../Svgs/ReactSVG";
import EmojiButton from "./EmojiButton";
import EmojiMembersList from "./EmojiMembersList";

const EmojiBar = (props) => {
    const {
        setEmojiVisible,
        emojiVisible,
        emojiData,
        addEmoji,
        currentUserId,
    } = props;
    // Initialize emoji counts state based on emojiData

    /**
     * Component that handles emoji reactions and renders emojis.
     *
     * @param {Object} props - The component's props.
     * @param {Object} props.emojiData - Data containing reactions and counts for emojis.
     * @returns {JSX.Element} A component to handle and render emoji reactions.
     */
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const [emojiContainerWidth, setEmojiContainerWidth] = useState(0);
    const [enableScroll, setEnableScroll] = useState(false);
    const [initialEmojiCounts, setInitialEmojiCounts] = useState({});
    const [emojiMembers, setEmojiMembers] = useState([]);
    const [showEmojiMembers, setShowEmojiMembers] = useState(false);
    const [EmojiMembersLoading, setEmojiMembersLoading] = useState(false);
    const [curDataKey, setCurDataKey] = useState("");
    const scrollViewRef = useRef(null);
    const emojiMembersListBottomSheetRef = useRef(null);

    useEffect(() => {
        const data = emojiData
            ? Object.entries(emojiData.reactions).reduce((counts, item) => {
                  counts[item[0]] = item[1].length; // Initialize counts for each emoji to 0
                  return counts;
              }, {})
            : {};
        setInitialEmojiCounts(data);
        setEmojiCounts(data);
    }, [emojiData]);

    const [emojiCounts, setEmojiCounts] = useState({
        increasing: true,
        initialEmojiCounts,
    });

    /**
     * Toggles the visibility of the emoji picker.
     */
    const toggleEmojiPicker = () => {
        setEmojiVisible(!emojiVisible);
    };

    /**
     * Handles the press event on an emoji.
     *
     * @param {string} emoji - The emoji that was pressed.
     */
    const handleEmojiPress = (emoji) => {
        if (emoji === "+") {
            toggleEmojiPicker();
        } else {
            addEmoji(emoji);
            // Check if the emoji is already in emojiCounts
            if (emojiCounts.hasOwnProperty(emoji)) {
                // Emoji already exists, check its count
                if (emojiCounts.increasing) {
                    setEmojiCounts((prevCounts) => ({
                        ...prevCounts,
                        [emoji]: prevCounts[emoji] + 1,
                        increasing: false,
                    }));
                } else {
                    setEmojiCounts((prevCounts) => ({
                        ...prevCounts,
                        [emoji]: prevCounts[emoji] - 1,
                        increasing: true,
                    }));
                }
            } else {
                // Emoji doesn't exist, add it with a count of 1
                setEmojiCounts((prevCounts) => ({
                    ...prevCounts,
                    [emoji]: 2,
                }));
            }
        }
    };

    const isMe = (dataKey) => {
        return emojiData.reactions[dataKey].some(
            (reaction) => reaction.author.id == currentUserId,
        );
    };

    const handleEmojiLongPress = (dataKey) => {
        const currMembers = emojiData.reactions[dataKey].map(
            (reaction) => reaction.author,
        );
        setShowEmojiMembers(true);
        setEmojiMembers(currMembers);
        setCurDataKey(dataKey);
    };

    useEffect(() => {
        // Re-render the emojis when emojiData changes
        emojiData ? renderEmoji() : null;
    }, [emojiData]);

    useEffect(() => {
        if (!emojiVisible) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [emojiVisible]);
    const renderEmoji = () => {
        const updatedReactions = emojiData.reactions;
        const data = Object.keys(updatedReactions).sort((a, b) => {
            const dateA = new Date(updatedReactions[a][0]?.createdAt);
            const dateB = new Date(updatedReactions[b][0]?.createdAt);
            return dateA - dateB;
        });
        return data.map((dataKey, index) => (
            <View key={index}>
                {updatedReactions[dataKey].length > 0 && (
                    <React.Fragment key={`${dataKey}${index}`}>
                        <EmojiButton
                            text={dataKey}
                            count={updatedReactions[dataKey]?.length}
                            onPress={() => handleEmojiPress(dataKey)}
                            onLongPress={() => handleEmojiLongPress(dataKey)}
                            isMe={isMe(dataKey)}
                        />
                    </React.Fragment>
                )}
            </View>
        ));
    };

    const viewLayoutHandler = (event) => {
        const { width } = event.nativeEvent.layout;
        setEmojiContainerWidth(width);
        if (width > scrollViewWidth) {
            setEnableScroll(true);
        } else {
            setEnableScroll(false);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    onLayout={(e) => {
                        setScrollViewWidth(e.nativeEvent.layout.width);
                    }}
                    scrollEnabled={enableScroll}
                    style={[
                        styles.scrollView,
                        { maxWidth: emojiContainerWidth },
                    ]}
                    contentContainerStyle={styles.scrollViewContent}
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    <View
                        onLayout={viewLayoutHandler}
                        style={styles.emojiContainer}
                    >
                        {emojiData && renderEmoji()}
                    </View>
                </ScrollView>
                <TouchableOpacity
                    testID="add-emoji"
                    style={styles.plusIcon}
                    onPress={() => {
                        setEmojiVisible(true);
                    }}
                >
                    <ReactSVG />
                </TouchableOpacity>
            </View>
            {showEmojiMembers && (
                <EmojiMembersList
                    setShowMemberListModal={setShowEmojiMembers}
                    showMemberListModal={showEmojiMembers}
                    membersInfo={emojiMembers}
                    curEmoji={curDataKey}
                    loading={EmojiMembersLoading}
                    sheetRef={emojiMembersListBottomSheetRef}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    scrollView: {
        height: 36,
    },
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    plusIcon: {
        height: 36,
        width: 44,
        backgroundColor: "#E7E7E7",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollViewCover: {
        flexDirection: "row",
        borderWidth: 1,
    },
    scrollViewContent: {
        flexDirection: "row",
    },
    emojiContainer: {
        flex: 1,
        flexDirection: "row",
    },
    add: {
        height: 28,
        width: 28,
    },
});

export default EmojiBar;
