import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import NotificationList from "../components/NotificationList";
import ReturnTabs from "../components/ReturnTabs";

/**
 * Renders the IndieNotification component.
 * This component displays notifications.
 * @returns {JSX.Element} React component for notifications.
 */
export default function IndieNotification() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.title}>Notifications</Text>
            <NotificationList />
            <ReturnTabs />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: "15%",
        marginHorizontal: "5%",
    },
});
