import { useNavigation } from "@react-navigation/native";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { avatarPrefix, defaultAvatar } from "../../config/constants";
import useApp from "../../hooks/useApp";
import useSocials from "../../hooks/useSocials";

const { width: ScreenWidth } = Dimensions.get("window");

/**
 * Avatar component to display user avatars.
 * @param {object} props - Props for the Avatar component.
 * @param {string} props.avatarSource - Source for the avatar image.
 * @param {string} props.displayName - Display name of the user.
 * @param {number} props.userId - ID of the user.
 * @param {number} props.level - Level associated with the avatar.
 * @param {Function} props.removeAvatar - Function to remove the avatar.
 * @param {boolean} props.showRemoveIcon - Indicates whether the remove icon is shown.
 * @param {Function} props.setShowRemoveIcon - Function to control the display of the remove icon.
 * @returns {JSX.Element} JSX for the Avatar component.
 */
const Avatar = (props) => {
    const {
        avatarSource,
        displayName,
        userId,
        level,
        removeAvatar,
        showRemoveIcon,
        setShowRemoveIcon,
    } = props;
    const { storage } = useApp();
    const navigation = useNavigation();
    const { deleteUser } = useSocials();

    /**
     * Navigates to the user's page.
     * @async
     * @function handleUserPage
     * @returns {void}
     */
    const handleUserPage = async () => {
        const userName = displayName;
        const userAvatar = avatarSource;
        navigation.navigate("UserPage", {
            userName,
            userAvatar,
            userId,
            myId: storage.id,
        });
    };

    /**
     * Handles a long press event.
     * @function handleLongPress
     * @returns {void}
     */
    const handleLongPress = () => {
        setShowRemoveIcon(true);
    };

    /**
     * Handles the removal of a user.
     * @async
     * @function handleRemove
     * @returns {void}
     */
    const handleRemove = async () => {
        const data = JSON.stringify({
            userIds: [userId],
        });

        try {
            await deleteUser(level, data);
            setShowRemoveIcon(false); // Hide the 'x' icon after removing the Avatar
            removeAvatar(level);
        } catch (error) {
            console.log(error); // 处理错误
        }
    };

    const truncatedDisplayName =
        displayName.length > 6
            ? displayName.substring(0, 6) + "..."
            : displayName;

    return (
        <View style={styles.userContainer}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={handleUserPage}
                onLongPress={handleLongPress}
            >
                <Image
                    style={styles.avatar}
                    source={{
                        uri: avatarSource
                            ? avatarPrefix + avatarSource
                            : avatarPrefix + defaultAvatar,
                    }}
                />
                {showRemoveIcon && (
                    <TouchableOpacity
                        style={styles.closeIconStyle}
                        onPress={handleRemove}
                    >
                        <Image
                            style={styles.closeIcon}
                            source={require("../../assets/boldIcons/CloseSquare.png")}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
            <Text>{truncatedDisplayName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {},
    avatar: {
        width: ScreenWidth * 0.12,
        height: ScreenWidth * 0.12,
        marginHorizontal: ScreenWidth * 0.0375,
        marginTop: ScreenWidth * 0.02,
        borderRadius: 75,
    },
    closeIconStyle: {
        left: ScreenWidth * 0.12,
        position: "absolute",
        height: 25,
        width: 25,
    },
    userContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    closeIcon: {
        height: 25,
        width: 25,
    },
});

export default Avatar;
