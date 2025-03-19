import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Button } from "react-native-elements";
import { showMessage } from "react-native-flash-message";
import RBSheet from "react-native-raw-bottom-sheet";
import Swiper from "react-native-swiper";

import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import useChannels from "../../hooks/useChannels";
import useDebounce from "../../hooks/useDebounce";
import useUsers from "../../hooks/useUsers";
import SearchInput from "../Channels/SearchInput";
import UserItem from "../CreateChannel/UserItem";
import Loader from "../Loader";

const CreateChannelModal = ({
    showCreateChannelModal,
    setShowCreateChannelModal,
    onChannelCreate,
    isEditMode,
    initialValues,
    sheetRef,
}) => {
    const [step, setStep] = useState(0);
    const [channelName, setChannelName] = useState(
        initialValues.channelName || "",
    );
    const [searchText, setSearchText] = useState("");
    const [description, setDescription] = useState(
        initialValues.description || "",
    );
    const [socialUsers, setSocialUsers] = useState([]);
    const { userData } = useApp();
    const currentUserData = {
        displayName: userData.displayName,
        id: userData.id,
        profileImageKey: userData.profileImageKey,
        userName: userData.userName,
    };
    const { getAllUsers } = useUsers();
    const [addedMembers, setAddedMembers] = useState(
        initialValues.addedMembers || [currentUserData],
    );
    const [initialAddedMembers, setInitialAddedMembers] = useState(
        initialValues.addedMembers || [currentUserData],
    );
    const [newMembers, setNewMembers] = useState([]);
    const [removedMembers, setRemovedMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [channelType, setChannelType] = useState(
        initialValues.type || "public",
    );

    const { createChannel, editChannel, deleteChannel } = useChannels();
    const buttonLabel = step === 0 ? "Next" : isEditMode ? "Save" : "Create";
    const sheetTitle = isEditMode ? "Edit Channel" : "Create a Channel";
    const swiperRef = useRef(null); // Ref for Swiper
    const channelNameInputRef = useRef();
    const channelDescriptionInputRef = useRef();

    useEffect(() => {
        if (showCreateChannelModal) {
            sheetRef?.current?.open();
        }
    }, [showCreateChannelModal]);

    const getSocialUsers = async (text) => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            const searchText = text.toLowerCase();

            const filteredData = data.filter((user) =>
                user.userName.toLowerCase().includes(searchText),
            );
            const sortedData = filteredData.sort((a, b) => {
                const aLower = a.userName.toLowerCase();
                const bLower = b.userName.toLowerCase();

                const aStartsWith = aLower.startsWith(searchText);
                const bStartsWith = bLower.startsWith(searchText);

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                return aLower.localeCompare(bLower);
            });

            const mappedSocialUsers = sortedData.map((member) => ({
                ...member,
                isSelected: false,
            }));
            setSocialUsers(mappedSocialUsers);
        } catch (err) {
            console.log("Error fetching team members:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    useDebounce(
        () => {
            if (searchText) {
                getSocialUsers(searchText);
            }
        },
        [searchText],
        500,
    );

    const handleChannelNameChange = (input) => {
        const formattedInput = input.replace(/\s/g, "");

        if (channelType === "private") {
            setChannelName(formattedInput.replace(/^#+/, ""));
        } else {
            setChannelName(`#${formattedInput.replace(/^#+/, "")}`);
        }
    };

    const handleChannelTypeChange = (type) => {
        setChannelType(type);
        if (type === "private") {
            setChannelName(channelName.replace(/^#+/, ""));
        } else {
            if (!channelName.startsWith("#")) {
                setChannelName(`#${channelName}`);
            }
        }
    };

    const handleToggleUser = (user) => {
        const index = addedMembers.findIndex((u) => u.id === user.id);
        if (index === -1) {
            setAddedMembers((prev) => [...prev, user]);
            setNewMembers((prev) => [...prev, user.id]);
            return;
        }

        setAddedMembers((prev) => prev.filter((u) => u.id !== user.id));

        if (newMembers.includes(user.id)) {
            setNewMembers((prev) => prev.filter((id) => id !== user.id));
        }

        if (initialAddedMembers.some((u) => u.id === user.id)) {
            setRemovedMembers((prev) => [...prev, user.id]);
        } else {
            setRemovedMembers((prev) => prev.filter((id) => id !== user.id));
        }
    };

    const handleCreateChannel = async () => {
        setIsLoading(true);
        try {
            console.log(
                "addedMembers: ",
                addedMembers.map((user) => user.id),
            );
            const payload = JSON.stringify({
                description,
                tag: channelName,
                members: addedMembers.map((user) => user.id),
                type: channelType,
            });
            const resp = await createChannel(payload);

            onChannelCreate();
            setShowCreateChannelModal(false);
            sheetRef?.current?.close();

            if (resp.success === false) {
                showMessage({
                    message: resp.message,
                    type: "danger",
                });
            }
        } catch (e) {
            console.error(e);
            if (e.statusCode === 500) {
                Alert.alert(e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handelEditChannel = async () => {
        console.log(initialValues.id);
        setIsLoading(true);
        try {
            const payload = {
                description,
                newMembers,
                removedMembers,
            };
            const resp = await editChannel(initialValues.id, payload);
            if (resp) {
                onChannelCreate();
                setShowCreateChannelModal(false);
                sheetRef?.current?.close();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Channel",
            "Are you sure you want to delete this channel?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDeleteChannel,
                },
            ],
            { cancelable: false },
        );
    };

    const handleDeleteChannel = async () => {
        setIsLoading(true);
        try {
            await deleteChannel(initialValues.id);
            setIsLoading(false);
            onChannelCreate();
            setShowCreateChannelModal(false);
            sheetRef?.current?.close();
        } catch (e) {
            console.error(e);
        }
    };

    const handleChannelStepNavigation = () => {
        if (step === 0) {
            swiperRef.current.scrollTo(1);
            setStep(1);
            return;
        }

        isEditMode ? handelEditChannel() : handleCreateChannel();
    };

    return (
        <RBSheet
            ref={sheetRef}
            height={Dimensions.get("screen").height * 0.8}
            openDuration={400}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => {
                setShowCreateChannelModal(false);
            }}
        >
            <View style={styles.modalHeader}>
                <Text style={styles.titleText}>{sheetTitle}</Text>
            </View>
            <Swiper
                ref={swiperRef}
                loop={false}
                index={step}
                onIndexChanged={(index) => {
                    setStep(index);
                }}
                showsPagination={step === 0}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={{ width: Dimensions.get("screen").width }}>
                        {/* Channel Name Input */}
                        <TouchableOpacity
                            style={styles.inputContainer}
                            activeOpacity={1}
                            onPress={() => {
                                channelNameInputRef.current?.focus();
                            }}
                            accessible={false}
                        >
                            {channelType === "private" && (
                                <FontAwesome5
                                    name="lock"
                                    size={16}
                                    color={theme.colors.lightBlue}
                                    style={{ marginRight: 5 }}
                                />
                            )}
                            <TextInput
                                placeholder={
                                    channelType === "private"
                                        ? "name-your-channel"
                                        : "#name-your-channel"
                                }
                                value={channelName}
                                onChangeText={handleChannelNameChange}
                                style={{
                                    ...styles.inputText,
                                    color: theme.colors.lightBlue,
                                    fontSize: 20,
                                }}
                                editable={!isEditMode}
                                autoCapitalize="none"
                                ref={channelNameInputRef}
                                testID="channel-tag-input"
                            />
                        </TouchableOpacity>
                        {/* Channel Visibility */}
                        <View style={styles.channelVisibility}>
                            <TouchableOpacity
                                onPress={() =>
                                    handleChannelTypeChange("public")
                                }
                                style={[
                                    styles.selectorButton,
                                    channelType === "public" &&
                                        styles.selectedButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.selectorText,
                                        channelType === "public" &&
                                            styles.selectedText,
                                    ]}
                                >
                                    Public
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    handleChannelTypeChange("private")
                                }
                                style={[
                                    styles.selectorButton,
                                    channelType === "private" &&
                                        styles.selectedButton,
                                ]}
                                accessible={false}
                            >
                                <Text
                                    style={[
                                        styles.selectorText,
                                        channelType === "private" &&
                                            styles.selectedText,
                                    ]}
                                >
                                    Private
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* Short Description */}
                        <TouchableOpacity
                            style={styles.inputBoxContainer}
                            onPress={() => {
                                channelDescriptionInputRef.current?.focus();
                            }}
                            activeOpacity={1}
                            accessible={false}
                        >
                            <TextInput
                                placeholder="Write a short description"
                                value={description}
                                onChangeText={setDescription}
                                style={[
                                    styles.inputText,
                                    {
                                        height: 100,
                                        textAlignVertical: "top",
                                    },
                                ]}
                                ref={channelDescriptionInputRef}
                                scrollEnabled
                                testID="channel-tag-desc"
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View
                        style={{
                            alignSelf: "center",
                            alignItems: "center",
                            width: Dimensions.get("screen").width,
                        }}
                    >
                        <Text style={styles.addUserText}>
                            Add users in Channel{" "}
                            {channelType === "private" ? (
                                <>
                                    <FontAwesome5 name="lock" size={14} />{" "}
                                    {channelName}
                                </>
                            ) : (
                                channelName
                            )}
                        </Text>
                        <SearchInput
                            searchText={searchText}
                            onSearchChange={handleSearchTextChange}
                            onClear={() => setSearchText("")}
                            placeholder="Search for Users"
                            containerStyle={styles.inputContainer}
                            inputStyle={{
                                ...styles.inputText,
                                textAlign: "left",
                                width: "75%",
                            }}
                            accessible={false}
                        />
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {searchText.length === 0 ? (
                                addedMembers.map((member, index) => (
                                    <UserItem
                                        key={index}
                                        member={member}
                                        isSelected={true}
                                        onToggle={handleToggleUser}
                                        isDisabled={member.id === userData.id}
                                    />
                                ))
                            ) : (
                                <>
                                    {!loading &&
                                        socialUsers.map((member, index) => (
                                            <UserItem
                                                key={index}
                                                member={member}
                                                isSelected={addedMembers.some(
                                                    (user) =>
                                                        user.id === member.id,
                                                )}
                                                onToggle={handleToggleUser}
                                                isDisabled={
                                                    member.id === userData.id
                                                }
                                            />
                                        ))}
                                    {socialUsers.length === 0 && !loading && (
                                        <Text
                                            style={{
                                                color: "#888",
                                            }}
                                        >
                                            No user found
                                        </Text>
                                    )}
                                    {loading && (
                                        <Loader
                                            size="small"
                                            color={theme.colors.lightBlue}
                                        />
                                    )}
                                </>
                            )}
                            <View style={{ height: 100 }} />
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </Swiper>
            {!isLoading && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        title={buttonLabel}
                        buttonStyle={{
                            width: isEditMode
                                ? Dimensions.get("screen").width * 0.4
                                : Dimensions.get("screen").width * 0.85,
                            borderRadius: 20,
                        }}
                        disabled={
                            step === 0
                                ? channelName.length < 4 ||
                                  description.length < 3
                                : channelName.length < 4 ||
                                  description.length < 3 ||
                                  addedMembers.length < 2
                        }
                        onPress={handleChannelStepNavigation}
                    />
                    {isEditMode && (
                        <Button
                            title="Delete"
                            buttonStyle={{
                                width: Dimensions.get("screen").width * 0.4,
                                borderRadius: 20,
                                marginLeft: 10,
                                backgroundColor: theme.colors.white,
                                borderWidth: 2,
                                borderColor: theme.colors.lightBlue,
                            }}
                            titleStyle={{
                                color: theme.colors.lightBlue,
                            }}
                            onPress={confirmDelete}
                        />
                    )}
                </View>
            )}
            {isLoading && <ActivityIndicator color={theme.colors.lightBlue} />}
        </RBSheet>
    );
};

export default CreateChannelModal;

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        // width: "100%",
        bottom: "0%",
        zIndex: 2,
        backgroundColor: "#fff",
        paddingVertical: 20,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    outerContainer: { height: "100%", backgroundColor: "#00000080" },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    titleText: {
        fontSize: 24,
        fontWeight: "700",
        marginHorizontal: 10,
    },
    inputContainer: {
        backgroundColor: "#E9E9E9",
        width: "85%",
        height: 40,
        marginVertical: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    inputBoxContainer: {
        backgroundColor: "#E9E9E9",
        width: "85%",
        height: 160,
        marginVertical: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "center",
        alignSelf: "center",
    },
    inputText: {
        fontSize: 16,
        textAlign: "center",
    },
    inputSearchText: {
        fontSize: 16,
        textAlign: "center",
        paddingLeft: 10,
    },
    addUserText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "500",
        marginTop: 20,
        paddingHorizontal: 12,
    },
    channelVisibility: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    selectorButton: {
        padding: 10,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: theme.colors.lightBlue,
        borderRadius: 20,
        width: "35%",
        alignItems: "center",
    },
    selectedButton: {
        backgroundColor: theme.colors.lightBlue,
    },
    selectorText: {
        fontSize: 16,
        color: theme.colors.lightBlue,
        fontWeight: "600",
    },
    selectedText: {
        color: "#fff",
    },
});
