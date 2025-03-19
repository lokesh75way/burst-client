import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Dimensions,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import Loader from "../components/Loader";
import { ArrowLeftSVG, EyeSVG, SlashEyeSVG } from "../components/Svgs";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { signupSchema } from "../services/yup";
const isBiggerScreen = Dimensions.get("screen").width >= 650;
const SignUp = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });
    // navigate to login page
    const goToLogin = () => {
        navigation.navigate("Login");
    };
    const { storage } = useApp();
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [confirmVisibility, setConfirmVisibility] = useState(true);
    const { register } = useAuth();

    // Navigates to the OTP (One-Time Password) screen with the user's email and specifies the next route as "Login".
    const goToOtp = () => {
        navigation.navigate("OtpScreen", {
            email: getValues("userEmail"),
            password: getValues("userPassword"),
            nextRoute: "Login",
        });
    };

    /**
     * Handles the signup process based on provided user data.
     * @async
     * @function handleSignup
     * @returns {void}
     */
    const onSubmitHandler = async (data) => {
        const userPassword = getValues("userPassword");
        const confirmPassword = getValues("confirmPassword");

        if (userPassword !== confirmPassword) {
            setPasswordError("** Please make sure your passwords match. **");
        } else {
            setLoading(true);
            setPasswordError("");
            // sent post request
            try {
                const data = JSON.stringify({
                    displayName: getValues("userDisplayName").trim(),
                    userName: getValues("userName").trim(),
                    email: getValues("userEmail"),
                    password: getValues("userPassword"),
                });

                const result = await register(data);
                if (result && result.success === false) {
                    Alert.alert("Sign Up Failed", result.message);
                    setLoading(false);
                    return;
                }
                Alert.alert(
                    "Sign Up Successfully",
                    "Enter otp sent to email id for verification",
                );
                goToOtp();
                await storage.setIsOnboarded("false");
                reset();
            } catch (error) {
                Alert.alert(
                    error?.message || "Sign Up Failed",
                    "Please try again later.",
                );
            }
        }
        setLoading(false);
    };

    const showKeyboard = () => {
        setIsKeyboardOpen(true);
    };

    const hideKeyboard = () => {
        setIsKeyboardOpen(false);
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            showKeyboard,
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            hideKeyboard,
        );
        // Cleanup listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.backgroundContainer}
            behavior={Platform.OS === "android" ? "height" : "padding"}
            enabled
        >
            <ImageBackground
                source={require("../assets/signup_background.png")}
                style={styles.background}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={styles.container}>
                        {!isKeyboardOpen && (
                            <>
                                <View style={styles.headerContainer}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={goToLogin}
                                    >
                                        <ArrowLeftSVG
                                            height={15}
                                            stroke="#fff"
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.textCurio}>Burst</Text>
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.textTitle}>
                                        Create Account
                                    </Text>
                                    <Text style={styles.textSubtitle}>
                                        Sign up now to share us your ideas
                                    </Text>
                                </View>
                                <View style={styles.line} />
                            </>
                        )}

                        <View
                            style={[
                                styles.inputContainer,
                                isKeyboardOpen && { marginTop: 250 },
                            ]}
                        >
                            <View style={styles.inputField}>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Your User Name"
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                    name="userName"
                                />
                                {errors.userName && (
                                    <Text style={styles.errorText}>
                                        {errors.userName.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputField}>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Your Display Name"
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                    name="userDisplayName"
                                />
                                {errors.userDisplayName && (
                                    <Text style={styles.errorText}>
                                        {errors.userDisplayName.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputField}>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Email"
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            autoCapitalize="none"
                                        />
                                    )}
                                    name="userEmail"
                                />
                                {errors.userEmail && (
                                    <Text style={styles.errorText}>
                                        {errors.userEmail.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputField}>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <View style={styles.field}>
                                            <TextInput
                                                style={styles.textContainer}
                                                placeholder="Password"
                                                onChangeText={onChange}
                                                value={value}
                                                secureTextEntry={
                                                    passwordVisibility
                                                }
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setPasswordVisibility(
                                                        (prev) => !prev,
                                                    );
                                                }}
                                                style={styles.icon}
                                            >
                                                {passwordVisibility ? (
                                                    <EyeSVG />
                                                ) : (
                                                    <SlashEyeSVG />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    name="userPassword"
                                />
                                {errors.userPassword && (
                                    <Text style={styles.errorText}>
                                        {errors.userPassword.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputField}>
                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <View style={styles.field}>
                                            <TextInput
                                                style={styles.textContainer}
                                                placeholder="Confirm Password"
                                                onChangeText={onChange}
                                                value={value}
                                                secureTextEntry={
                                                    confirmVisibility
                                                }
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setConfirmVisibility(
                                                        (prev) => !prev,
                                                    );
                                                }}
                                                style={styles.icon}
                                            >
                                                {confirmVisibility ? (
                                                    <EyeSVG />
                                                ) : (
                                                    <SlashEyeSVG />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    name="confirmPassword"
                                />
                                {errors.confirmPassword && (
                                    <Text style={styles.errorText}>
                                        {errors.confirmPassword.message}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.errorTextContainer}>
                                {passwordError ? (
                                    <Text style={styles.errorText}>
                                        {passwordError}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={[styles.submitContainer]}>
                            {loading && <Loader size="small" />}
                            {!loading && (
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={handleSubmit(onSubmitHandler)}
                                >
                                    <Text style={styles.submitText}>
                                        Get Started
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    backgroundContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // marginVertical: "2%",
        padding: "5%",
    },

    headerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },

    button: {
        height: 32,
        width: 33,
        color: "white",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 10,
        fontWeight: "600",
        alignItems: "center",
        justifyContent: "center",
    },

    textCurio: {
        fontSize: 28,
        lineHeight: 0,
        height: 35,
        width: 80,
        fontFamily: "Helvetica",
        color: "white",
        marginLeft: "30%",
        fontWeight: "600",
    },

    titleContainer: {
        flex: 1,
        // marginBottom: 50,
        // marginTop: '50%',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    textTitle: {
        fontSize: 40,
        textAlign: "center",
        fontFamily: "Helvetica",
        color: "deepskyblue",
        fontWeight: "600",
    },

    textSubtitle: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "Helvetica",
        color: "skyblue",
        fontWeight: "400",
    },

    inputContainer: {
        flex: 1,
        marginTop: 150,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: isBiggerScreen ? "15%" : "20%",
    },

    inputField: {
        flex: 1,
        marginTop: isBiggerScreen ? "15%" : "20%",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "blue",
        width: "100%",
    },

    buttonContainer: {
        height: 30,
    },

    input: {
        width: "100%",
        height: 42,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
        bottom: isBiggerScreen ? "15%" : "20%",
        paddingLeft: 10,
        flexDirection: "row",
        // marginBottom: 5,
    },

    inputName1: {
        width: "40%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },

    inputName2: {
        width: "40%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        flex: 1,
    },

    line: {
        height: 1,
        marginTop: "5%",
        marginBottom: "2%",
        backgroundColor: "lightgray",
        width: "100%",
        bottom: "4%",
    },

    errorText: {
        marginTop: -70,
        marginBottom: 53,
        marginLeft: 5,
        color: "red",
        fontSize: 14,
    },

    errorTextContainer: {
        marginTop: "10%",
        alignItems: "center",
        width: "100%",
    },

    submitContainer: {
        width: "100%",
        padding: 0,
        marginTop: 60,
        height: 50,
        borderRadius: 10,
        backgroundColor: "skyblue",
    },

    disabledSubmitContainer: {
        width: "100%",
        padding: 0,
        marginTop: 30,
        height: 50,
        borderRadius: 10,
        backgroundColor: "lightgray",
    },

    submitText: {
        fontSize: 23,
        lineHeight: 50,
        height: 52,
        width: "100%",
        fontFamily: "Helvetica",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "400",
        margin: 0,
    },
    icon: {
        width: 18,
        height: 18,
        position: "absolute",
        right: 8,
    },
    field: {
        flexDirection: "row",
        width: "100%",
        height: 42,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
        bottom: isBiggerScreen ? "15%" : "20%",
        paddingLeft: 10,
        alignItems: "center",
    },
    textContainer: {
        width: "90%",
        height: "100%",
    },
});

export default SignUp;
