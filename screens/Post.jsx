import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import FullScreenPicture from "../components/FullScreenPicture";
import MyImagePicker from "../components/ImagePicker";
import Loader from "../components/Loader";
import MyViewer from "../components/MyViewer";
import ReturnTabs from "../components/ReturnTabs";
import VisibilitySelector from "../components/VisibilitySelector";
import useApp from "../hooks/useApp";
import usePosts from "../hooks/usePosts";

const { height } = Dimensions.get("window");
const scrollViewMaxHeight = height * 0.9;

const Post = ({ navigation }) => {
    const [content, setContent] = useState("");
    const [fullScreenPictureUrl, setFullScreenPictureUrl] = useState("");
    const [showFullScreenPicture, setShowFullScreenPicture] = useState(false);
    const [imageKeys, setImageKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [allowNewPost, setAllowNewPost] = useState(false);
    // State variable to track the number of ongoing image uploads
    const [uploadCounter, setUploadCounter] = useState(0);
    // const [clickedPost, setClickedPost] = useState(false);
    const [showMyViewer, setShowMyViewer] = useState(false);
    const [showRemoveIcon, setShowRemoveIcon] = useState(false);
    const [selectedVisibility, setSelectedVisibility] = useState(4);
    const [isLevelSelectorOpen, setLevelSelectorOpen] = useState(false);
    const { addPost, loading, setLoading } = usePosts();
    const isFocused = useIsFocused();
    const { setActiveRoute } = useApp();

    /**
     * Handles the change in visibility.
     * @function handleVisibilityChange
     * @param {boolean} selected - The selected visibility state.
     * @returns {void}
     */
    const handleVisibilityChange = (selected) => {
        setSelectedVisibility(selected);
    };

    /**
     * Automatically triggers post sending when specific conditions are met.
     * @function useEffectTriggerSendPost
     * @returns {void}
     */
    // useEffect(() => {
    //     if (uploadCounter === 0 && modalVisible === false && clickedPost) {
    //         sendPost(); // Automatically trigger sendPost when uploadCounter becomes zero and modalVisible is true
    //     }
    // }, [uploadCounter, modalVisible]);

    // navigate to home page
    /**
     * Navigates to the Home page.
     * @function goToHome
     * @returns {void}
     */
    const goToHome = () => {
        setActiveRoute("Home");
        navigation.navigate("Home", {
            scrollToTop: true,
            reloadFeed: true,
        });
    };

    /**
     * Sends a post to the server.
     * @async
     * @function sendPost
     * @returns {void}
     */
    const sendPost = async () => {
        try {
            // setClickedPost(true);
            if (uploadCounter > 0) {
                setModalVisible(true); // Show the modal
                // Wait until isLoading becomes false
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (uploadCounter === 0) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 1000);
                });
            } else {
                const data = JSON.stringify({
                    text: content.trim(),
                    mediaKeys: imageKeys,
                });
                const resp = await addPost(data);
                if (resp && resp.success === false) {
                    Alert.alert(resp.message);
                    return;
                }
                goToHome();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setModalVisible(false);
            setLoading(false);
        }
    };

    /**
     * Toggles the visibility of MyViewer.
     * @function toggleMyViewer
     * @returns {void}
     */
    // Step 3: Implement a function to toggle the visibility of MyViewer
    const toggleMyViewer = () => {
        setShowMyViewer(!showMyViewer);
    };

    /**
     * Handles the removal of the 'x' icon.
     * @function handleRemoveIcon
     * @returns {void}
     */
    const handleRemoveIcon = () => {
        setShowRemoveIcon(false);
    };

    /**
     * Toggles the level selector.
     * @function toggleLevelSelector
     * @returns {void}
     */
    const toggleLevelSelector = () => {
        setLevelSelectorOpen(!isLevelSelectorOpen);
    };

    /**
     * Resets various states upon focus change.
     * @function resetStatesOnFocusChange
     * @returns {void}
     */
    useEffect(() => {
        setContent("");
        setImageKeys([]);
        setUploadCounter(0);
        setLevelSelectorOpen(false);
        setFullScreenPictureUrl("");
        setShowFullScreenPicture(false);
        setShowMyViewer(false);
        setLevelSelectorOpen(false);
        setShowRemoveIcon(false);
    }, [isFocused]);

    useEffect(() => {
        if (content.trim().length > 0 || imageKeys.length > 0) {
            setAllowNewPost(true);
        } else {
            setAllowNewPost(false);
        }
    }, [content, imageKeys]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
                style={styles.postIconContainer}
                onPress={sendPost}
                disabled={!allowNewPost}
            >
                <Image
                    style={styles.postIcon}
                    source={require("../assets/boldIcons/Send.png")}
                />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={handleRemoveIcon}>
                    <View style={{ flex: 0.65, backgroundColor: "pink" }}>
                        <View style={styles.container}>
                            <ScrollView
                                contentContainerStyle={styles.scrollViewContent}
                            >
                                <TextInput
                                    style={styles.description}
                                    placeholder="What's on your mind?"
                                    multiline
                                    maxLength={1000}
                                    value={content}
                                    onChangeText={(text) => setContent(text)}
                                />
                                <MyImagePicker
                                    key={isFocused}
                                    setShowFullScreenPicture={
                                        setShowFullScreenPicture
                                    }
                                    setFullScreenPictureUrl={
                                        setFullScreenPictureUrl
                                    }
                                    imageKeys={imageKeys}
                                    setImageKeys={setImageKeys}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    setModalVisible={setModalVisible}
                                    uploadCounter={uploadCounter} // Pass the uploadCounter
                                    setUploadCounter={setUploadCounter} // Pass the setUploadCounter function
                                    sendPost={sendPost}
                                />
                                {loading && <Loader />}
                            </ScrollView>

                            <Modal visible={modalVisible} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ActivityIndicator
                                        size="large"
                                        color="black"
                                    />
                                    <Text>
                                        Uploading images, please wait...
                                    </Text>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={{
                        position: "absolute",
                        top: "65%",
                        paddingHorizontal: "5%",
                        width: "100%",
                    }}
                >
                    <View style={styles.container}>
                        <TouchableOpacity onPress={toggleMyViewer}>
                            <View style={styles.listItemContainer}>
                                <Image
                                    style={styles.listIcon}
                                    resizeMode="contain"
                                    source={require("../assets/boldIcons/Circle.png")}
                                    size={30}
                                />
                                <Text style={styles.listItemText}>
                                    Initial visibility
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <ScrollView
                            contentContainerStyle={styles.myViewerScrollView}
                        >
                            {showMyViewer && (
                                <MyViewer
                                    showRemoveIcon={showRemoveIcon}
                                    setShowRemoveIcon={setShowRemoveIcon}
                                />
                            )}
                        </ScrollView>

                        <TouchableOpacity onPress={toggleLevelSelector}>
                            <View style={styles.listItemContainer}>
                                <Image
                                    style={styles.listIcon}
                                    resizeMode="contain"
                                    source={require("../assets/blackIcons/Burst.png")}
                                    size={30}
                                />
                                <Text style={styles.listItemText}>
                                    Set maximum visibility
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {isLevelSelectorOpen && (
                            <VisibilitySelector onSelect={() => {}} />
                        )}

                        <View style={styles.listItemContainer} />
                    </View>
                </View>
            </View>

            <ReturnTabs />

            {showFullScreenPicture && (
                <FullScreenPicture
                    fullScreenPictureUrl={fullScreenPictureUrl}
                    setShowFullScreenPicture={setShowFullScreenPicture}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        maxHeight: scrollViewMaxHeight,
        flexGrow: 1,
    },
    whoWillSeeButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 10,
        paddingHorizontal: "1%",
        marginLeft: "5%",
        marginRight: "5%",
        borderRadius: 5,
        alignContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: "30%",
    },
    whoWillSeeButtonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },

    header: {
        fontSize: 18,
        marginBottom: 10,
    },
    myViewerScrollView: {
        maxHeight: "100%",
        flexGrow: 1,
    },
    listIcon: {
        height: 20,
        width: 20,
    },

    container: {
        flex: 1,
        display: "fixed",
        height: "88%",
        width: "100%",
        paddingTop: "20%",
        paddingLeft: "5%",
        paddingRight: "5%",
        backgroundColor: "#f0f2f5",
    },

    description: {
        fontSize: 18,
        color: "black",
        letterSpacing: -0.2,
        paddingTop: 20,
        paddingBottom: 20,
        width: "90%",
        maxHeight: "60%",
    },

    postIcon: {
        height: 32,
        width: 32,
    },
    postIconContainer: {
        height: 40,
        width: 40,
        position: "absolute",
        top: "5%",
        right: "5%",
        zIndex: 2,
    },

    listItemContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
    },

    listItemText: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default Post;
