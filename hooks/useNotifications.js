import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import useApp from "./useApp";
import useUsers from "./useUsers";

/**
 * Custom hook for handling notifications.
 * @returns {{
 *   sendNotification: (payload: object) => Promise<void>
 * }}
 */
function useNotifications() {
    const [notification, setNotification] = useState(false);
    const { deviceTokenSave } = useUsers();
    const { notification: indieNotification } = useApp();

    // const { notification } = useApp();
    const notificationListener = useRef();
    const responseListener = useRef();

    /**
     * Send a notification using the provided payload.
     * @param {object} payload - Notification payload to be sent.
     * @returns {Promise<void>}
     */
    const sendNotification = async (payload) => {
        await indieNotification.post(`/indie/notification`, payload);
    };

    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } =
                    await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                console.log("Failed to get push token for push notification!");
                return;
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId,
                })
            ).data;
            if (token) {
                deviceTokenSave(token);
            }
        } else {
            console.log("Must use physical device!");
        }
        return token;
    };

    const initializeNotifications = () => {
        registerForPushNotificationsAsync();

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response);
                },
            );
    };

    useEffect(() => {
        return () => {
            if (notificationListener.current && responseListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current,
                );
                Notifications.removeNotificationSubscription(
                    responseListener.current,
                );
            }
        };
    }, []);

    return {
        sendNotification,
        initializeNotifications,
    };
}

export default useNotifications;
