import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import theme from "../../config/theme";
import { fetchKey, getImageUrl } from "../../helpers/commonFunction";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import Button from "../Button";
import AuthorImage from "../FeedPost/AuthorImage";
import GalleryLoader from "../GalleryLoader";
import Loader from "../Loader";
import ImageHolder from "../PostInput/ImageHolder";
import Picker from "../PostInput/Picker";
import SuggestedChannels from "../PostInput/SuggestedChannels";

const PostReplyModal = (props) => {
    const {
        onCancel,
        userName,
        userData,
        post,
        setReplyCount,
        addLocalReply,
        authors: rawAuthors,
    } = props;

    const authors = [...new Set(rawAuthors)];

    const inset = useSafeAreaInsets();
    const { addPost } = usePosts();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [containerHeight, setContainerHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const [selectedChannelIds, setSelectedChannelIds] = useState([]);
    const [excludedChannelsIds, setExcludedChannelsIds] = useState([]);
    const [excluedNotJoined, setExcludeNotJoined] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const scrollRef = useRef();
    const inputRef = useRef();
    const pickerRef = useRef(null);
    const scrollToEnd = () => {
        if (scrollRef.current) {
            scrollRef.current?.scrollToEnd({ animated: true });
        }
    };
    const [allUsers, setAllUsers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [mentions, setMentions] = useState([]);
    const { getAllUsers } = useUsers();

    const getUsers = async () => {
        // setMentions([]);
        console.log(mentions);
        const data = await getAllUsers();
        setAllUsers(data);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleInputChange = (input) => {
        setReplyText(input);

        // Check if the last character is '@'
        const lastChar = input[input.length - 1];

        if (lastChar === "@") {
            setShowSuggestions(true);
            setSuggestedUsers(allUsers.slice(0, 3)); // Show first 3 users by default
        } else if (showSuggestions && lastChar !== " ") {
            // Keep showing suggestions if input is not empty and not a space
            const lastAtIndex = input.lastIndexOf("@");
            const textAfterAt = input.slice(lastAtIndex + 1).trim();
            if (textAfterAt) {
                setSuggestedUsers(
                    allUsers
                        .filter((user) =>
                            user.userName
                                .toLowerCase()
                                .includes(textAfterAt.toLowerCase()),
                        )
                        .slice(0, 3),
                );
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }

        scrollToEnd();
    };

    const handleMentionSelect = (username, user) => {
        const textBeforeAt = replyText.slice(0, replyText.lastIndexOf("@"));
        setReplyText(`${textBeforeAt}@${username} `);
        setShowSuggestions(false);

        // Update the mentions state with the selected user
        if (!mentions.find((mention) => mention.id === user.id)) {
            setMentions([...mentions, user]);
        }
    };

    const sendReply = async () => {
        setLoading(true);
        const imageKeys = [];
        try {
            const compressedImages =
                await pickerRef.current.compressAllImages();
            setImages(compressedImages);

            for (const image of compressedImages) {
                const key = await fetchKey(image);
                imageKeys.push(key);
            }
            const data = JSON.stringify({
                text: replyText.trim(),
                mediaKeys: imageKeys,
                suggestedChannels: selectedChannelIds,
                excludedChannels: excludedChannelsIds,
                isExcludedUnjoinedChannels: excluedNotJoined,
                replyingToId: post.id,
                tagedUsers: mentions.map((user) => user.id),
            });
            setSelectedChannelIds([]);
            const resp = await addPost(data);
            if (resp && resp.success === false) {
                console.log("Error in replying to post");
                console.log(resp.message);
                return;
            }
            setReplyCount((prev) => prev + 1);
            onCancel();
            const localReply = {
                ...resp,
                betaReviews: [],
                counts: {
                    reply: 0,
                    quote: 0,
                },
                media: images,
                quote: null,
                reactions: [],
                author: {
                    ...resp.author,
                    profileImageKey: userData.profileImageKey,
                    userName: userData.userName,
                    displayName: userData.displayName,
                },
            };
            addLocalReply?.(localReply);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const labelContent = loading ? (
        <Loader size="small" color="white" />
    ) : (
        "Reply"
    );
    const layoutContainerHeight = (e) => {
        setContainerHeight(e.nativeEvent.layout.height);
    };
    const layoutContentHeight = (e) => {
        setContentHeight(e.nativeEvent.layout.height);
    };
    const removeImage = (image) => {
        const updatedImages = images.filter((i) => i !== image);
        setImages(updatedImages);
    };

    const imageUrl = getImageUrl(userData?.profileImageKey);
    const disableBtn = replyText.trim().length == 0 && images.length == 0;
    const inputContainerHeight =
        images.length <= 3 ? 350 : images.length <= 6 ? 550 : 750;
    return (
        <Modal visible animationType="slide" statusBarTranslucent={false}>
            {loading && (
                <GalleryLoader
                    label="Replying..."
                    images={images}
                    setImages={setImages}
                />
            )}
            {!loading && (
                <SafeAreaView>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={showPicker}
                    >
                        <View
                            style={[
                                styles.replyInput,
                                // { marginTop: inset.top },
                                {
                                    height: inputContainerHeight,
                                    maxHeight: inputContainerHeight,
                                },
                            ]}
                        >
                            <View style={styles.btnContainer}>
                                <View style={styles.btn}>
                                    <Button
                                        label="Cancel"
                                        variant="outlined"
                                        outlinedColor="#268EC8"
                                        color="#268EC8"
                                        onPress={onCancel}
                                    />
                                </View>
                                <View style={styles.btn}>
                                    <Button
                                        label={labelContent}
                                        bgColor="#268EC8"
                                        onPress={sendReply}
                                        outlinedColor="#268EC8"
                                        disabled={disableBtn}
                                    />
                                </View>
                            </View>
                            <View style={styles.line} />
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    inputRef.current?.focus();
                                }}
                                accessible={false}
                            >
                                <View
                                    style={styles.replyContent}
                                    onLayout={layoutContainerHeight}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={styles.container}>
                                            <View style={styles.vertical} />
                                            <AuthorImage
                                                size={48}
                                                imageUrl={imageUrl}
                                                disabled
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.content}>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.replyText}>
                                                Replying to{" "}
                                                {authors &&
                                                authors.length > 0 ? (
                                                    authors.map(
                                                        (author, index) => (
                                                            <React.Fragment
                                                                key={index}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.authorText
                                                                    }
                                                                >
                                                                    @{author}
                                                                </Text>
                                                                {index <
                                                                    authors.length -
                                                                        1 && (
                                                                    <Text
                                                                        style={
                                                                            styles.replyText
                                                                        }
                                                                    >
                                                                        {" "}
                                                                        and{" "}
                                                                    </Text>
                                                                )}
                                                            </React.Fragment>
                                                        ),
                                                    )
                                                ) : (
                                                    <Text
                                                        style={
                                                            styles.authorText
                                                        }
                                                    >
                                                        @{userName}
                                                    </Text>
                                                )}
                                            </Text>
                                        </View>

                                        {containerHeight > 0 && (
                                            <View>
                                                <ScrollView
                                                    ref={scrollRef}
                                                    showsVerticalScrollIndicator={
                                                        false
                                                    }
                                                    style={styles.inputScroll}
                                                    scrollEnabled={
                                                        contentHeight >
                                                        containerHeight
                                                    }
                                                >
                                                    <TextInput
                                                        ref={inputRef}
                                                        onLayout={
                                                            layoutContentHeight
                                                        }
                                                        style={
                                                            styles.inputField
                                                        }
                                                        placeholder="Post your reply"
                                                        placeholderTextColor="#666666"
                                                        multiline
                                                        value={replyText}
                                                        onChange={scrollToEnd}
                                                        onChangeText={
                                                            handleInputChange
                                                        }
                                                    />
                                                </ScrollView>
                                                {showSuggestions && (
                                                    <FlatList
                                                        data={suggestedUsers}
                                                        keyExtractor={(item) =>
                                                            item.id.toString()
                                                        }
                                                        renderItem={({
                                                            item,
                                                        }) => (
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    handleMentionSelect(
                                                                        item.userName,
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                <Text
                                                                    style={{
                                                                        padding: 10,
                                                                        color: theme
                                                                            .colors
                                                                            .lightBlue,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.userName
                                                                    }
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}
                                                        style={
                                                            styles.suggestionsList
                                                        }
                                                    />
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            {images.length > 0 && (
                                <View
                                    style={{
                                        height: "45%",
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ImageHolder
                                        images={images}
                                        removeImage={removeImage}
                                        extraStyles={{ marginBottom: 10 }}
                                    />
                                </View>
                            )}
                        </View>
                        <SuggestedChannels
                            onChannelsSelected={(
                                suggestedIds,
                                excludedIds,
                                excludeNotJoined,
                            ) => {
                                setSelectedChannelIds(suggestedIds);
                                setExcludedChannelsIds(excludedIds);
                                setExcludeNotJoined(excludeNotJoined);
                            }}
                            isCanceled={isCanceled}
                            resetCancel={() => setIsCanceled(false)}
                        />
                        <Picker
                            ref={pickerRef}
                            images={images}
                            setImages={setImages}
                            showPicker={showPicker}
                            setShowPicker={setShowPicker}
                        />
                    </ScrollView>
                </SafeAreaView>
            )}
        </Modal>
    );
};

export default PostReplyModal;

const styles = StyleSheet.create({
    replyInput: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#00000050",
        alignItems: "center",
        marginHorizontal: 20,

        overflow: "hidden",
    },
    btnContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    btn: {
        width: "25%",
    },
    line: {
        backgroundColor: "#CED5DC",
        height: 1,
        width: "100%",
    },
    replyContent: {
        width: "100%",
        paddingHorizontal: 10,
        flexDirection: "row",
        gap: 10,
        flex: 1,
    },
    replyText: {
        color: "#666666",
        fontSize: 12,
    },
    authorText: {
        fontSize: 12,
        color: "#0091E2",
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    inputScroll: {
        width: "95%",
    },
    inputField: {
        fontSize: 20,
        color: "#666666",
        textAlign: "left",
        width: "100%",
        marginBottom: 4,
        paddingBottom: 60,
    },
    content: {
        flex: 1,
    },
    replier: {
        alignItems: "center",
    },
    vertical: {
        backgroundColor: "#CED5DC",
        height: 25,
        width: 2,
    },
    textContainer: {
        height: 25,
        flexWrap: "wrap",
        flexDirection: "row",
        marginTop: 5,
    },
    container: { alignItems: "center" },
    loadingContainer: {
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    uploadText: {
        fontSize: 16,
        color: theme.colors.primary,
    },
    suggestionsList: {
        maxHeight: 100,
        backgroundColor: "#fff",
        width: "90%",
        position: "absolute",
        top: 50,
        zIndex: 1,
    },
});
