import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    BellIcon,
    CircledUserIcon,
    DoubleUserIcon,
    HomeIcon,
    PlusIconSVG,
} from "../components/Svgs/index";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useSocials from "../hooks/useSocials";
import useUsers from "../hooks/useUsers";

const styles = StyleSheet.create({
    badgeContainer: {
        position: "absolute",
        top: 4,
        right: 15,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        zIndex: 3,
    },
    countText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 10,
    },
    container: {
        height: "10.4%",
        width: "100%",
        position: "absolute",
        bottom: 0,
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginTop: 9,
    },
    menu: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    postButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.lightBlue,
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    icon: {
        height: 40,
        width: 40,
    },
    menuText: {
        fontSize: 9,
        marginTop: -3,
    },
});

/**
 * Renders an unread notification badge based on the provided count.
 * @memberof UnreadNotificationBadge
 * @param {number} count - The count of unread notifications.
 * @returns {JSX.Element | null} JSX Element for the badge or null if count is 0.
 */
const UnreadNotificationBadge = ({ count }) => {
    if (count === 0) {
        return null; // If count is 0, don't render the badge
    }

    return (
        <View style={styles.badgeContainer}>
            <Text style={styles.countText}>{count}</Text>
        </View>
    );
};

export default function Tabs({ navigation }) {
    const [menuMargin, setMenuMargin] = useState({});
    const screenWidth = Dimensions.get("window").width;
    const { getCircles } = useSocials();
    const {
        storage,
        activeRoute,
        setActiveRoute,
        unreadNotificationCount,
        setUnreadNotificationCount,
    } = useApp();
    const myId = storage.id;
    const { getUnreadNotificationCount } = useUsers();

    useEffect(() => {
        const windowWidth = screenWidth;
        const styleMenu = {
            marginLeft: (windowWidth - 240) / 8,
            marginRight: (windowWidth - 240) / 8,
        };
        setMenuMargin(styleMenu);
    }, []);

    useEffect(() => {
        fetchNotificationNumber();
    }, []);

    const fetchNotificationNumber = async () => {
        try {
            if (myId) {
                const data = await getUnreadNotificationCount();
                setUnreadNotificationCount(data.unreadNotificationCount);
            }
        } catch (error) {
            console.log("Error: in tabs", error);
        }
    };

    // Check Circle data
    /**
     * Fetches data for a specific circle with ID 10.
     * @returns {Promise<Array>} A promise resolving to an array of circle members' data.
     */
    const fetch10CircleData = async () => {
        try {
            const data = await getCircles(10);
            return data.members;
        } catch (error) {
            console.log("Error: ", error.toString());
        }
    };

    /**
     * Navigates to the YourTeam screen after fetching circle data.
     */
    const goToYourTeam = async () => {
        // const circle_10 = await fetch10CircleData();
        setActiveRoute("YourTeam");
        navigation.navigate("YourTeam");
    };

    /**
     * Navigates to the Post screen.
     */
    const goToPost = () => {
        setActiveRoute("Post");
        navigation.navigate("Post");
    };

    /**
     * Navigates to the Notification screen.
     */
    const goToNotification = () => {
        setUnreadNotificationCount(0);
        setActiveRoute("Notification");
        navigation.navigate("Notification");
    };

    /**
     * Navigates to the Home screen.
     */
    const goToHome = () => {
        setActiveRoute("Home");
        navigation.navigate("Home", { scrollToTop: true, reloadFeed: false });
    };

    /**
     * Navigates to the Profile screen.
     */
    const goToProfile = () => {
        setActiveRoute("Profile");
        navigation.navigate("Profile");
    };

    /**
     * Sets the fill color for icons
     */
    const fillColor = (routeName) => {
        return activeRoute === routeName ? "#268EC8" : "#268EC866";
    };

    if (activeRoute === "Post") {
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menu} onPress={goToHome}>
                <HomeIcon {...styles.icon} fill={fillColor("Home")} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menu}
                onPress={goToYourTeam}
                testID="team-nav-icon"
            >
                <DoubleUserIcon {...styles.icon} fill={fillColor("YourTeam")} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menu}
                onPress={goToPost}
                testID="create-post-tab-icon"
            >
                <View style={styles.postButton}>
                    <PlusIconSVG width={24} height={24} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menu}
                onPress={goToNotification}
                testID="notification-nav-icon"
            >
                <BellIcon {...styles.icon} fill={fillColor("Notification")} />
                <UnreadNotificationBadge
                    count={
                        unreadNotificationCount ? unreadNotificationCount : 0
                    }
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menu}
                onPress={goToProfile}
                testID="profile-nav-icon"
            >
                <CircledUserIcon {...styles.icon} fill={fillColor("Profile")} />
            </TouchableOpacity>
        </View>
    );
}
