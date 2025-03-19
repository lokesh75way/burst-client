import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";

import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import ChannelTag from "../FeedPost/ChannelTag";
import QuotePreview from "../FeedPost/QuotePreview.jsx";
import { TrashSVG } from "../Svgs";
/**
 * Component for rendering an individual post item.
 * @param {object} props - The properties passed to the PostItem component.
 * @param {object} props.item - The post item to render.
 * @param {Function} props.setPostList - Function to set the post list.
 * @returns {JSX.Element} A component to display an individual post item.
 */

const PostItem = (props) => {
    const { item, setPostList, showActions, myChannels } = props;
    const { isERT, burstedChannels } = item;
    const { setReload } = useApp();
    const { deletePost } = usePosts();
    const navigation = useNavigation();
    const [isDisabled, setIsDisabled] = useState(false);

    /**
     * Handles the deletion of a post.
     * @async
     * @function handleDeletePress
     * @returns {Promise<void>} A Promise indicating the completion of the deletion process.
     */

    const handleDeletePress = async () => {
        await deletePost(item.id);
        setPostList((prevPostList) =>
            prevPostList.filter((post) => post.id !== item.id),
        );
        setReload(true);
    };

    const handleDeleteModal = () => {
        Alert.alert(
            "Delete post",
            "Are you sure, you want to delete this post ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                },
                {
                    text: "Delete",
                    onPress: () => handleDeletePress(),
                },
            ],
        );
    };

    const flattenChannels = (channels) => {
        return channels.map(({ channel, ...rest }) => ({
            ...rest,
            ...channel,
        }));
    };

    const onPostClickHandler = (type) => {
        if (isDisabled) return;

        if (item?.id) {
            setIsDisabled(true);
            navigation.push("PostDetailStack", {
                screen: "PostDetail",
                params: {
                    post: type === "quote" ? item.quote : item,
                },
            });
            setTimeout(() => setIsDisabled(false), 500);
        } else {
            showMessage({ message: "Post not available!", type: "info" });
        }
    };

    const getDateString = () => {
        const dayObj = dayjs(item.createdAt);
        return dayObj.format("MMM D, YYYY");
    };

    const containerStyles = isERT
        ? styles.greenContainer
        : styles.blueContainer;
    const textStyles = isERT ? styles.greenText : styles.blueText;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPostClickHandler}
            style={styles.postItem}
            disabled={isDisabled}
            accessible={false}
        >
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={styles.dateText}>{getDateString()}</Text>
                    {showActions && (
                        <TouchableOpacity
                            style={styles.trash}
                            onPress={handleDeleteModal}
                            testID="delete-post"
                        >
                            <TrashSVG />
                        </TouchableOpacity>
                    )}
                </View>
                {showActions && isERT && (
                    <View style={styles.btnContainer}>
                        <View style={containerStyles}>
                            <Text style={textStyles}>Your Team</Text>
                        </View>
                    </View>
                )}
                {burstedChannels && (
                    <ChannelTag
                        postId={item.id}
                        burstedChannels={flattenChannels(burstedChannels)}
                        isProfilePage
                        myChannels={myChannels}
                        disabled
                    />
                )}
                <Text
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={{ fontSize: 16 }}
                >
                    {item.text || (item.media.length > 0 ? "🏞️" : "")}
                </Text>

                {item.quote && (
                    <QuotePreview
                        onPress={() => {
                            onPostClickHandler("quote");
                        }}
                        post={item.quote}
                        type="item"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    postItem: {
        flexDirection: "row",
        width: "100%",
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#CED5DC",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    media: {
        height: 70,
        width: 70,
        alignSelf: "center",
        borderRadius: 6,
        marginRight: 10,
    },
    skeleton: {
        height: 70,
        width: 70,
        alignSelf: "center",
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: "#cccccc40",
    },
    blueContainer: {
        borderWidth: 1,
        borderColor: "#0091E2",
        borderRadius: 20,
        backgroundColor: "#0091E210",
        paddingHorizontal: 20,
        paddingVertical: 2,
        margin: 2,
    },
    blueText: {
        fontSize: 12,
        color: "#0091E2",
    },
    greenContainer: {
        borderWidth: 1,
        borderColor: "#5DB458",
        borderRadius: 20,
        backgroundColor: "#5DB458",
        paddingHorizontal: 20,
        paddingVertical: 2,
        margin: 2,
    },
    greenText: {
        fontSize: 12,
        color: "#fff",
    },

    post: {
        flexDirection: "column",
    },
    postDate: {
        fontSize: 12,
        color: "#828282",
    },
    postImage: {
        height: 20,
        width: 20,
    },
    trash: {
        paddingHorizontal: 8,
    },
});

export default PostItem;
