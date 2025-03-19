import { deleteIndieNotificationInbox } from "native-notify";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { notificationCode, notificationNumber } from "../../config/constants";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import Loader from "../Loader";
import NotificationItem from "./NotificationItem";

/**
 * Represents a list of notifications.
 * @function NotificationList
 * @returns {JSX.Element} JSX element representing the notification list.
 */

const NotificationList = (props) => {
    const { data, loading, setPage, endReached, refreshing, onRefresh } = props;
    /**
     * State to manage notification data.
     * @type {[Array<any>, Function]}
     */

    // const [data, setData] = useState([]);

    /**
     * State to manage post details.
     * @type {[object, Function]}
     */

    const [postDetails, setPostDetails] = useState({});
    const { getPost } = usePosts();
    const { storage, totalMemory } = useApp();
    const myId = storage.id;

    /**
     * Retrieves post details for a given post ID.
     * @async
     * @function fetchDataForPost
     * @param {number} postId - The ID of the post.
     * @returns {Promise<object>} A Promise with post data.
     */

    const fetchDataForPost = async (postId) => {
        try {
            const data = await getPost(postId);
            return data;
        } catch (error) {
            console.log("Error: ", error.response);
        }
    };

    /**
     * Capitalizes the first letter of a string.
     * @param {string} str - The input string.
     * @returns {string} The string with the first letter capitalized.
     */

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Deletes a notification by ID.
     * @async
     * @function deleteNotification
     * @param {number} notificationId - The ID of the notification to be deleted.
     * @returns {Promise<void>} A Promise indicating the completion of the deletion process.
     */

    const deleteNotification = async (notificationId) => {
        await deleteIndieNotificationInbox(
            myId,
            notificationId,
            notificationNumber,
            notificationCode,
        );
        // use filter function and delete the specific notification_id
        const updatedData = data.filter(
            (item) => item.notification_id !== notificationId,
        );
        // update the data
        // setData(updatedData);
    };

    const renderItemProps = {
        Capitalize,
        deleteNotification,
    };
    const onEndReached = () => {
        setPage((page) => page + 1);
    };

    const loader = loading ? (
        <View style={styles.loading}>
            <Loader size="small" color="skyblue" />
        </View>
    ) : (
        <></>
    );

    const NoNotifications = () => {
        return (
            <View style={styles.noNotificationContainer}>
                <Text style={{ color: theme.colors.grey }}>
                    No Notifications
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.list}>
            <FlatList
                removeClippedSubviews={totalMemory <= 4}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={(props) => <NotificationItem {...props} />}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={2 / 5}
                ListFooterComponent={!endReached && !refreshing && loader}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={<NoNotifications />}
            />
        </View>
    );
};

export default NotificationList;

const styles = StyleSheet.create({
    list: {
        flex: 1,
        marginBottom: 80,
    },
    loading: {
        marginVertical: 5,
    },
    noNotificationContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
