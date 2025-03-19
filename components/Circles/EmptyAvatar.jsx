import { useNavigation } from "@react-navigation/native";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { avatarGrey, avatarPrefix } from "../../config/constants";

const { width: ScreenWidth } = Dimensions.get("window");

/**
 * EmptyAvatar component used to represent an empty avatar placeholder.
 * @param {object} props - Props for the EmptyAvatar component.
 * @param {number} props.level - Level associated with the empty avatar.
 * @returns {JSX.Element} JSX for the EmptyAvatar component.
 */

const EmptyAvatar = ({ level }) => {
    const navigation = useNavigation();

    /**
     * Navigate to AddUsers screen to add a new user in the specified circle.
     */
    const setNewUserInCircle = () => {
        navigation.navigate("AddUsers", { level });
    };

    return (
        <View style={styles.userContainer}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={setNewUserInCircle}
            >
                <Image
                    style={styles.avatar}
                    source={{ uri: avatarPrefix + avatarGrey }}
                />
            </TouchableOpacity>
            <Text />
        </View>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    avatarContainer: {},
    avatar: {
        width: ScreenWidth * 0.12,
        height: ScreenWidth * 0.12,
        marginHorizontal: ScreenWidth * 0.0375,
        marginTop: ScreenWidth * 0.02,
        borderRadius: 75,
    },
});

export default EmptyAvatar;
