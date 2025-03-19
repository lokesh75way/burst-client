import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { defaultAvatar, picturePrefix } from "../../config/constants";

/**
 * Represents an individual post item in the notification list.
 * @function PostItem
 * @param {object} props - The component props.
 * @param {object} props.item - The data for the post item.
 * @param {Function} props.deleteNotification - Function to delete a notification.
 * @param {Function} props.Capitalize - Function to capitalize the first letter of a string.
 * @returns {JSX.Element} JSX element representing the post item.
 */

const PostItem = ({ item, deleteNotification, Capitalize }) => {
    dayjs.extend(relativeTime);
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);

    const navigation = useNavigation();
    /**
     * Parses the push data from the item.
     */
    // const parsePushData = JSON.parse(item.pushData);
    // const truncatedText = item.message.length > 80 ? item.message.slice(0, 100) + '...' : item.message;
    // const text =
    //     parsePushData.comment && parsePushData.commentText
    //         ? parsePushData.commentText
    //         : "";
    const truncatedText =
        item?.body?.length > 30 ? item?.body.slice(0, 28) + "..." : item?.body;

    const timestamp = item?.createdAt;

    /**
     * Handles the deletion of the notification.
     * @function handleDeletePress
     */

    const handleDeletePress = () => {
        // deleteNotification(item.notification_id);
    };

    const getDateText = () => {
        const dayObj = dayjs(timestamp);
        if (dayObj.isToday()) {
            return dayObj.format("hh:mm A");
        } else if (dayObj.isYesterday()) {
            return "Yesterday";
        } else {
            return dayObj.fromNow(true);
        }
    };

    const postClickHandler = () => {
        navigation.navigate("SinglePost", { item, isNotification: true });
    };

    const imageUrl = item?.fromUser?.profileImageKey
        ? picturePrefix + item?.fromUser?.profileImageKey
        : picturePrefix + defaultAvatar;

    return (
        <>
            <TouchableOpacity
                onPress={postClickHandler}
                style={[
                    styles.item,
                    !item?.status && { backgroundColor: "#268EC810" },
                ]}
            >
                <Image
                    source={{
                        uri: imageUrl,
                    }}
                    style={styles.media}
                />
                <View style={{ marginVertical: 5, flex: 1 }}>
                    {item?.fromUser?.displayName ? (
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                marginBottom: 3,
                            }}
                        >
                            {String(item?.fromUser?.displayName)}
                        </Text>
                    ) : null}
                    {truncatedText ? (
                        <Text style={{ fontSize: 16 }}>
                            {String(truncatedText)}
                        </Text>
                    ) : null}
                    {item?.burst ? (
                        <Image
                            source={require("../../assets/blackIcons/Bursted.png")}
                            style={{ height: 20, width: 20 }}
                        />
                    ) : null}
                    {timestamp ? (
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#828282",
                                position: "absolute",
                                bottom: 2,
                            }}
                        >
                            {getDateText()}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 5,
                        height: 20,
                        width: 20,
                    }}
                    onPress={handleDeletePress}
                >
                    {/* <Image
                        source={require("../../assets/boldIcons/Delete.png")}
                        style={{ height: 20, width: 20 }}
                    /> */}
                </TouchableOpacity>
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
    media: {
        height: 70,
        width: 70,
        alignSelf: "center",
        marginRight: "2%",
        borderRadius: 6,
        marginLeft: 8,
    },
    item: {
        flexDirection: "row",
        height: 80,
        borderRadius: 8,
    },
});

export default PostItem;
