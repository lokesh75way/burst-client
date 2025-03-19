import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// import { notificationCode, notificationNumber } from "../config/constants";
import NotificationList from "../components/NotificationList";
import NotificationSkeletonList from "../components/NotificationList/NotificationSkeletonList";
import ReceivedButton from "../components/NotificationList/ReceivedButton";
import useInvitation from "../hooks/useInvitation";
import useUsers from "../hooks/useUsers";

/**
 * Renders the Notification component.
 * This component displays the user's notifications.
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @returns {JSX.Element} React component for displaying notifications.
 */
export default function Notification({ navigation }) {
    const [data, setData] = useState([]);
    const { getNotification } = useUsers();
    const { getInvitations } = useInvitation();
    const [invitations, setInvitations] = useState([]);
    const [page, setPage] = useState(1);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const isInitialMount = useRef(true);
    const [endRecahed, setEndReached] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                setToInitialPage();
            }
            getYourInvitations();
        }
    }, [isFocused]);
    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [page, isFocused]);
    const setToInitialPage = () => {
        setPage(1);
    };

    const getYourInvitations = async () => {
        try {
            const data = await getInvitations();
            const pendingInvites = data.filter(
                (invite) => invite.status === "pending",
            );
            setInvitations(pendingInvites.slice(0, 2));
        } catch (err) {
            console.log("error, ", err);
        }
    };

    const fetchData = async () => {
        const isInitial = page === 1;
        if (data.length >= totalCount && !isInitial) {
            setEndReached(true);
            return;
        }
        if (endRecahed && !isInitial) return;
        try {
            if (isInitial && initialLoading) setInitialLoading(true);
            setLoading(true);
            const data = await getNotification({ page });
            setTotalCount(data.count);
            if (data.list.length === 0) {
                setEndReached(true);
            } else {
                setEndReached(false);
            }
            setData((content) => [
                ...(isInitial ? [] : content),
                ...(data?.list ?? []),
            ]);
        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setInitialLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setEndReached(false);
        setTotalCount(0);
        setPage(1);
        setInitialLoading(false);
        // setData([]);
        fetchData();
    };

    return (
        <View style={styles.container}>
            <Text
                style={{
                    ...styles.title,
                    marginTop: Platform.OS === "android" ? 10 : 50,
                }}
            >
                Notifications
            </Text>
            <ReceivedButton pendingInvitations={invitations} />
            {initialLoading && <NotificationSkeletonList />}
            {!initialLoading && (
                <NotificationList
                    loading={loading}
                    data={data}
                    setPage={setPage}
                    endReached={endRecahed}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
