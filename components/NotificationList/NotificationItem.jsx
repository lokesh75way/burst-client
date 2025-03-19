import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    DeviceEventEmitter,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

import burstImage from "../../assets/icons/burst.png";
import { picturePrefix } from "../../config/constants";
import { NotificationTypes } from "../../config/data";
import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import useChannels from "../../hooks/useChannels";
import AuthorImage from "../FeedPost/AuthorImage";
const NotificationItem = ({ item }) => {
    dayjs.extend(relativeTime);
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);
    const { setActiveRoute, userData } = useApp();

    const navigation = useNavigation();
    const timestamp = item?.createdAt;
    const { addRemoveUser } = useChannels();

    const getDateText = () => {
        const dayObj = dayjs(timestamp);
        const timeString = dayObj.fromNow(true);
        return `${timeString} ago`;
    };
    const postClickHandler = () => {
        if (item?.post?.id) {
            navigation.push("PostDetailStack", {
                screen: "PostDetail",
                params: {
                    post: item.post,
                },
            });
        } else {
            showMessage({ message: "Post not available!", type: "info" });
        }
    };
    const imageUrl = getImageUrl(item?.fromUser?.profileImageKey);
    let postUrl = item?.post?.media?.length
        ? picturePrefix + item.post.media[0].key
        : null;
    const types = [
        NotificationTypes.COMMENT,
        NotificationTypes.REACTION,
        NotificationTypes.REPLY,
        NotificationTypes.BURST,
        NotificationTypes.EVERYONE,
        NotificationTypes.ACCEPT,
    ];

    if (types.includes(item.type) && postUrl == null) {
        postUrl = "default";
    }
    const isInvitation = item?.type === NotificationTypes.INVITE;
    const isAddChannel = item?.type === NotificationTypes.ADDCHANNEL;
    const isRemoveChannel = item?.type === NotificationTypes.REMOVECHANNEL;
    const isBurst = item?.type === NotificationTypes.BURST;
    const isAccept = item?.type === NotificationTypes.ACCEPT;
    const isBurstIcon =
        item?.type === NotificationTypes.BURST ||
        item?.type === NotificationTypes.EVERYONE;
    const isShareert = item?.type === NotificationTypes.SHAREERT;

    const navigateToChannelDetail = () => {
        navigation.navigate("ChannelDetails", {
            channelId: item.channel.id,
            channelTag: item?.channel?.tag,
        });
    };

    // const TextContent = () => (
    //     <View style={styles.textContainer}>
    //         <Text style={styles.username}>
    //             {item?.fromUser?.displayName &&
    //                 item?.type !== NotificationTypes.BURST &&
    //                 item?.type !== NotificationTypes.EVERYONE && (
    //                     <>
    //                         {isShareert
    //                             ? `${item?.fromUser.displayName}'s `
    //                             : `${item?.fromUser.displayName} `}
    //                     </>
    //                 )}
    //             <Text style={styles.body}>{item?.body}</Text>
    //             {(isAddChannel || isRemoveChannel || isBurst) && (
    //                 <Text style={{ color: theme.colors.lightBlue }}>
    //                     {item?.channel?.tag}
    //                 </Text>
    //             )}
    //         </Text>
    //         {timestamp && <Text style={styles.timestamp}>{getDateText()}</Text>}
    //     </View>
    // );

    const TextContent = () => (
        // hard coded private channel
        <View style={styles.textContainer}>
            <Text style={styles.username}>
                {item?.fromUser?.displayName &&
                    item?.type !== NotificationTypes.BURST &&
                    item?.type !== NotificationTypes.EVERYONE && (
                        <>
                            {isShareert
                                ? `${item?.fromUser.displayName}'s `
                                : `${item?.fromUser.displayName} `}
                        </>
                    )}
                <Text style={styles.body}>{item?.body}</Text>
                {(isAddChannel || isRemoveChannel || isBurst) && (
                    <Text
                        style={{
                            color: theme.colors.lightBlue,
                        }}
                        onPress={navigateToChannelDetail}
                    >
                        {" "}
                        {item?.channel.type === "private" && (
                            <FontAwesome5
                                name="lock"
                                size={12}
                                color={theme.colors.lightBlue}
                                style={{ marginRight: 4 }}
                            />
                        )}
                        {item?.channel?.tag}
                    </Text>
                )}
            </Text>
            {timestamp && <Text style={styles.timestamp}>{getDateText()}</Text>}
        </View>
    );

    const handleNavigate = () => {
        navigation.navigate("Invitations");
    };
    const handleLeave = async () => {
        try {
            await addRemoveUser(item?.channel?.id, "remove");
            showMessage({
                message: `Left Channel ${item?.channel?.tag}`,
                type: "success",
            });
            DeviceEventEmitter.emit("getChannels");
        } catch (e) {
            showMessage({
                message: `Alredy Left ${item?.channel?.tag}`,
                type: "none",
            });
        }
    };
    const navigateToTeam = () => {
        setActiveRoute("YourTeam");
        navigation.navigate("YourTeam");
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={isAccept ? navigateToTeam : postClickHandler}
            disabled={isInvitation || isAddChannel}
            style={[styles.item, !item?.status && styles.lightBg]}
            accessible={false}
        >
            <View style={styles.startBox}>
                {isBurstIcon ? (
                    <Image source={burstImage} style={styles.media} />
                ) : item?.type === NotificationTypes.SHAREERT ? (
                    <View style={styles.releaseContainer}>
                        <AuthorImage
                            size={55}
                            imageBorder={styles.imageBorder}
                            imageUrl={imageUrl}
                            disabled
                        />
                        <View style={styles.releaseBox}>
                            <Text style={styles.releaseText}>
                                {item?.fromUser.displayName}'s Team
                            </Text>
                        </View>
                    </View>
                ) : (
                    <AuthorImage size={55} imageUrl={imageUrl} disabled />
                )}
            </View>

            {!isInvitation && (
                <View style={styles.postContent}>
                    <TextContent />
                    <Text numberOfLines={3} style={styles.postContentText}>
                        {item?.post?.text}
                    </Text>
                </View>
            )}

            {isAddChannel && (
                <>
                    <TouchableOpacity
                        onPress={handleLeave}
                        style={{ ...styles.checkBtn, ...styles.leaveBtn }}
                    >
                        <Text
                            style={{
                                ...styles.checkText,
                                color: theme.colors.lightBlue,
                            }}
                        >
                            Leave
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {isInvitation && (
                <>
                    <TextContent />
                    <TouchableOpacity
                        onPress={handleNavigate}
                        style={styles.checkBtn}
                    >
                        <Text style={styles.checkText}>See invite</Text>
                    </TouchableOpacity>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    media: {
        height: 55,
        width: 55,
        borderRadius: 30,
        backgroundColor: "white",
    },
    mediaSkeleton: {
        height: 55,
        width: 55,
        borderRadius: 30,
        backgroundColor: "#cccccc40",
    },
    item: {
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "flex-start",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderBottomColor: "#CED5DC",
        paddingVertical: 16,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
    },
    body: {
        fontSize: 16,
        color: "#232323",
        fontWeight: "600",
    },
    timestamp: {
        fontSize: 16,
        color: "#777777",
        fontWeight: "500",
    },
    postContainer: {
        position: "relative",
        overflow: "hidden",
    },
    post: {
        height: 60,
        width: 60,
        alignSelf: "center",
        borderRadius: 6,
    },
    postSkeleton: {
        height: 60,
        width: 60,
        alignSelf: "center",
        borderRadius: 6,
        backgroundColor: "#cccccc40",
    },
    postContentText: {
        color: "#8B8B8B",
        fontSize: 16,
        marginVertical: 4,
        paddingRight: 20,
    },
    checkBtn: {
        backgroundColor: "#0091E2",
        width: 80,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 8,
    },
    checkText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    imageBorder: {
        borderWidth: 4,
        borderColor: theme.colors.lightgreen,
    },
    textContainer: {
        flex: 1,
        display: "flex",
        // flexDirection: "row",
    },
    releaseContainer: {
        alignItems: "center",
        position: "relative",
    },
    releaseBox: {
        borderColor: theme.colors.lightgreen,
        borderWidth: 2,
        borderRadius: 4,
        position: "absolute",
        bottom: -6,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
    },
    releaseText: {
        fontWeight: "bold",
        fontSize: 8,
        color: theme.colors.lightgreen,
        textAlign: "center",
    },
    postText: {
        fontWeight: "300",
        fontSize: 16,
        color: "#000",
    },
    startBox: {
        width: "25%",
        alignItems: "center",
    },
    endBox: {
        width: "25%",
        alignItems: "center",
    },
    empty: {
        width: "10%",
    },
    lightBg: {
        backgroundColor: "#268EC810",
    },
    postContent: {
        flex: 1,
        paddingRight: 10,
    },
    invitationContainer: {
        flexDirection: "row",
    },
    leaveBtn: {
        backgroundColor: "#fff",
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
    },
});

export default NotificationItem;
