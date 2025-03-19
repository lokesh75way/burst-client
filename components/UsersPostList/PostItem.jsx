import { useNavigation } from "@react-navigation/core";
import { DateTime } from "luxon";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { imageBaseUrl, picturePrefix } from "../../config/constants";
import usePosts from "../../hooks/usePosts";
import CachedImage from "../CachedImage";

/**
 * Renders a single post item.
 *
 * @typedef {Object} Post
 * @property {string} id - The unique identifier of the post.
 * @property {string} text - The text content of the post.
 * @property {string} createdAt - The timestamp of post creation.
 * @property {Array} media - List of media attached to the post.
 */
const PostItem = ({ item, setPostList }) => {
    const { deletePost } = usePosts();
    const navigation = useNavigation();

    let truncatedText = "";
    if (item.text) {
        truncatedText =
            item.text.length > 100
                ? item.text.slice(0, 100) + "..."
                : item.text;
    }
    const imageUrl = item.media?.length
        ? picturePrefix + item.media[0].key
        : `${imageBaseUrl}/defaultPostImg.jpeg`;

    /**
     * Deletes the specified post and updates the post list.
     *
     * @async
     * @function handleDeletePress
     * @param {Object} item - The post object to be deleted.
     * @param {string} item.id - The unique identifier of the post.
     * @param {Function} setPostList - Function to update the post list.
     * @returns {Promise<void>}
     */
    const handleDeletePress = async () => {
        try {
            await deletePost(item.id);
            setPostList((prevPostList) =>
                prevPostList.filter((post) => post.id !== item.id),
            );
        } catch (error) {
            console.error(error.response);
        }
    };

    /**
     * Capitalizes the first character of a string.
     *
     * @function Capitalize
     * @param {string} str - The input string.
     * @returns {string} - The input string with the first character capitalized.
     */
    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const postClickHandler = () => {
        navigation.navigate("SinglePost", { item });
    };

    return (
        <>
            <TouchableOpacity
                onPress={postClickHandler}
                style={{ flexDirection: "row", height: 80 }}
            >
                <CachedImage
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    loader={<View style={styles.skeleton} />}
                />
                <View
                    style={{
                        marginVertical: 5,
                        flex: 1,
                        flexDirection: "column",
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{truncatedText}</Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "#828282",
                            position: "absolute",
                            bottom: 2,
                        }}
                    >
                        {Capitalize(
                            DateTime.fromISO(
                                item.createdAt,
                            ).toRelativeCalendar(),
                        )}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.separator} />
        </>
    );
};

const styles = StyleSheet.create({
    separator: {
        marginTop: 0,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
    },
    image: {
        height: 70,
        width: 70,
        alignSelf: "center",
        marginRight: "2%",
        borderRadius: 6,
    },
    skeleton: {
        height: 70,
        width: 70,
        alignSelf: "center",
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: "#cccccc40",
    },
});

export default PostItem;
