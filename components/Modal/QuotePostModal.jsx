import { useNavigation } from "@react-navigation/core";
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
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import theme from "../../config/theme";
import { fetchKey, getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import Button from "../Button";
import AuthorImage from "../FeedPost/AuthorImage";
import QuotePreview from "../FeedPost/QuotePreview";
import GalleryLoader from "../GalleryLoader";
import Loader from "../Loader";
import ImageHolder from "../PostInput/ImageHolder";
import Picker from "../PostInput/Picker";
import { CrossSVG } from "../Svgs";

const QuotePostModal = (props) => {
    const { post, onCancel, userData, setQuoteCount, onRefresh } = props;
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [showQuote, setShowQuote] = useState(true);
    const [quoteText, setQuoteText] = useState("");
    const [containerHeight, setContainerHeight] = useState(0);
    const [textHeight, setTextHeight] = useState(0);
    const [quoteHeight, setQuoteHeight] = useState(0);
    const [showPicker, setShowPicker] = useState(false);
    const { addPost } = usePosts();
    const { id } = post;
    const inset = useSafeAreaInsets();
    const pickerRef = useRef(null);
    const scrollRef = useRef();
    const [allUsers, setAllUsers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [mentions, setMentions] = useState([]);
    const { getAllUsers } = useUsers();
    const { setReloadProfile, setActiveRoute } = useApp();
    const inputContainerHeight =
        images.length <= 3 ? 350 : images.length <= 6 ? 550 : 750;

    const scrollToEnd = () => {
        if (scrollRef.current) {
            scrollRef.current?.scrollToEnd({ animated: true });
        }
    };
    const navigation = useNavigation();

    const quotePost = async () => {
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
                text: quoteText.trim(),
                mediaKeys: imageKeys,
                quoteId: id,
                tagedUsers: mentions.map((user) => user.id),
            });
            const resp = await addPost(data);
            if (resp && resp.success === false) {
                console.log(resp.message);
                return;
            }
            setQuoteCount((prev) => prev + 1);
            onCancel();
            navigation.navigate("Home", {
                scrollToTop: true,
                reloadFeed: true,
            });
            setActiveRoute("Home");
            setReloadProfile(true);
            onRefresh();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

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
        setQuoteText(input);

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
        const textBeforeAt = quoteText.slice(0, quoteText.lastIndexOf("@"));
        setQuoteText(`${textBeforeAt}@${username} `);
        setShowSuggestions(false);

        // Update the mentions state with the selected user
        if (!mentions.find((mention) => mention.id === user.id)) {
            setMentions([...mentions, user]);
        }
    };

    const labelContent = loading ? (
        <Loader size="small" color="white" />
    ) : (
        "Post"
    );
    const removeImage = (image) => {
        const updatedImages = images.filter((i) => i !== image);
        setImages(updatedImages);
    };
    const postDisbaled =
        loading || (quoteText.trim().length == 0 && images.length == 0);
    const enableScroll = textHeight + quoteHeight > containerHeight;
    const layoutContainerHeight = (e) => {
        setContainerHeight(e.nativeEvent.layout.height);
    };
    const layoutTextHeight = (e) => {
        setTextHeight(e.nativeEvent.layout.height);
    };
    const layoutQuoteHeight = (e) => {
        setQuoteHeight(e.nativeEvent.layout.height);
    };
    const imageUrl = getImageUrl(userData?.profileImageKey);
    return (
        <Modal visible animationType="slide" statusBarTranslucent={false}>
            {loading && <GalleryLoader images={images} setImages={setImages} />}
            {!loading && (
                <SafeAreaView>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={showPicker}
                    >
                        <View
                            style={[
                                styles.quoteInput,
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
                                        onPress={quotePost}
                                        outlinedColor="#268EC8"
                                        disabled={postDisbaled}
                                    />
                                </View>
                            </View>
                            <View
                                style={styles.quoteContent}
                                onLayout={layoutContainerHeight}
                            >
                                <AuthorImage
                                    imageUrl={imageUrl}
                                    size={48}
                                    disabled
                                />
                                {containerHeight > 0 && (
                                    <View style={styles.commentContent}>
                                        <ScrollView
                                            ref={scrollRef}
                                            showsVerticalScrollIndicator={false}
                                            style={styles.inputScroll}
                                            scrollEnabled={enableScroll}
                                        >
                                            <TextInput
                                                scrollEnabled={false}
                                                style={styles.inputField}
                                                placeholder="Add a comment"
                                                placeholderTextColor="#666666"
                                                multiline
                                                value={quoteText}
                                                onChange={scrollToEnd}
                                                onChangeText={handleInputChange}
                                                onLayout={layoutTextHeight}
                                            />
                                        </ScrollView>
                                        {showSuggestions && (
                                            <FlatList
                                                data={suggestedUsers}
                                                keyExtractor={(item) =>
                                                    item.id.toString()
                                                }
                                                renderItem={({ item }) => (
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
                                                            {item.userName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                                style={styles.suggestionsList}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>

                            {images.length > 0 && (
                                <View
                                    style={{
                                        height: "40%",
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ImageHolder
                                        images={images}
                                        removeImage={removeImage}
                                        extraStyles={showQuote && styles.extra}
                                    />
                                </View>
                            )}
                            {showQuote && (
                                <View
                                    style={[styles.original, styles.shadowProp]}
                                    onLayout={layoutQuoteHeight}
                                >
                                    <QuotePreview
                                        setQuoteHeight={setQuoteHeight}
                                        type="modal"
                                        post={post}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowQuote(false);
                                        }}
                                        style={styles.cross}
                                    >
                                        <CrossSVG
                                            width={20}
                                            height={20}
                                            fill="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

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

export default QuotePostModal;

const styles = StyleSheet.create({
    quoteInput: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#00000050",
        alignItems: "center",
        marginHorizontal: 20,

        overflow: "hidden",
        paddingBottom: 8,
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
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    quoteContent: {
        width: "100%",
        paddingHorizontal: 10,
        flexDirection: "row",
        gap: 10,
        flex: 1,
    },
    commentContent: {
        flex: 1,
    },
    inputField: {
        fontSize: 20,
        color: "#666666",
        textAlign: "left",
        width: "100%",
        marginBottom: 4,
    },
    inputScroll: {
        width: "100%",
        marginBottom: 10,
        // paddingBottom: 0,
        flex: 1,
    },
    galleryContainer: {
        height: "42%",
    },
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
    cross: {
        position: "absolute",
        backgroundColor: "#268EC8",
        borderRadius: 20,
        top: -5,
        right: -5,
        borderWidth: 2,
        borderColor: "#fff",
    },
    original: {
        width: "95%",
    },
    shadowProp: {
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: -25 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    extra: {
        marginBottom: "-10%",
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
