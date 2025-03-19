import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Divider } from "react-native-elements";
import { Provider } from "react-native-paper";
import { Skeleton } from "react-native-skeletons";

import CachedImage from "../components/CachedImage";
import ImageLoader from "../components/ImageLoader";
import UserImageViewModal from "../components/Modal/UserImageViewModal";
import { LeftArrowSVG } from "../components/Svgs";
import UsersPostList from "../components/UsersPostList";
import theme from "../config/theme";
import { getImageUrl } from "../helpers/commonFunction";
import useSocials from "../hooks/useSocials";
import useUsers from "../hooks/useUsers";

const UserPage = ({ route }) => {
    const { userName, avatar, userId,fromTeam } = route.params;
    const [isModalVisible, setModalVisible] = useState(false);
    const [circle, setCircle] = useState(0);
    const [postList, setPostList] = useState([]);
    const { getProfile } = useUsers();
    const { addUser } = useSocials();
    const isFocused = useIsFocused();
    const [isFollow, setIsFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [displayName, setDisplayName] = useState();

    const navigation = useNavigation();

    /**
     * Fetches profile data for the specified user.
     * @async
     * @function fetchData
     * @returns {void}
     */
    async function fetchData() {
        try {
            setIsLoading(true);
            const data = await getProfile(userId);
            setDisplayName(data.displayName);
            setPostList(data.posts);
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // Only fetch data when the screen is in focus
        if (isFocused) {
            fetchData();
        }
        return () => {
            setPostList([]);
        };
    }, [isFocused]);

    // const containerStyle = {backgroundColor: 'white'};

    /**
     * Adds users with a specified level.
     * @async
     * @function addUsers
     * @param {string} userId - The user ID to add.
     * @param {number} level - The level value.
     * @returns {void}
     */
    const addUsers = async (userId, level) => {
        const data = JSON.stringify({
            userIds: [userId],
        });

        try {
            await addUser(level, data);
            setCircle(Number(level));
        } catch (error) {
            console.error(error);
        }
    };

    const imageUrl = getImageUrl(avatar);

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            const data = await getProfile(userId);
            setPostList(data.posts);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        fromTeam?
                        navigation.navigate("YourTeam"):
                        navigation.goBack();
                    }}
                    style={styles.backButton}
                >
                    <LeftArrowSVG />
                </TouchableOpacity>
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        activeOpacity={0.8}
                    >
                        {!isLoading && (
                            <CachedImage
                                key={avatar}
                                source={{ uri: imageUrl }}
                                style={styles.avatar}
                                resizeMode="cover"
                                loader={
                                    <ImageLoader width={120} height={120} />
                                }
                            />
                        )}
                        {isLoading && (
                            <Skeleton
                                width={100}
                                height={100}
                                borderRadius={50}
                            />
                        )}
                    </TouchableOpacity>
                    <View style={styles.userNameContainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.displayName}
                        >
                            {displayName}
                        </Text>
                        <Text style={styles.userName} numberOfLines={1}>
                            @{userName}
                        </Text>
                    </View>
                </View>
                <Divider width={1.5} />
                {isLoading && (
                    <ActivityIndicator
                        color={theme.colors.lightBlue}
                        size={30}
                    />
                )}
                {!isLoading && (
                    <UsersPostList
                        postList={postList}
                        setPostList={setPostList}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
            </View>
            <UserImageViewModal
                isVisible={isModalVisible}
                onClose={() => {
                    setModalVisible(false);
                }}
                imageUrl={imageUrl}
                avatar={avatar}
            />
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        backgroundColor: "#fff",
    },
    avatarContainer: {
        paddingVertical: 20,
        alignItems: "flex-start",
        width: "30%",
    },
    profileContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        gap: 8,
    },
    followContainer: {
        flexDirection: "row",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 75,
    },
    displayName: {
        fontSize: 24,
        fontWeight: "bold",
    },
    userNameContainer: {
        width: "70%",
        justifyContent: "center",
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
    },
    logoutButton: {
        backgroundColor: "skyblue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "center",
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
    followButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 20,
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
    },
    followText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
    card: {
        borderRadius: 10,
        margin: 20,
        padding: 10,
        bottom: "10%",
    },
    backButton: {
        width: 40,
        height: 30,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    modalContent: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        backgroundColor: "#fff",
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    userName: {
        marginVertical: 6,
        color: theme.colors.grey,
        fontSize: 16,
    },
});

export default UserPage;
