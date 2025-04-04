import { yupResolver } from "@hookform/resolvers/yup";
import { useIsFocused } from "@react-navigation/core";
import { CommonActions } from "@react-navigation/native";
import { registerIndieID } from "native-notify";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

import Loader from "../components/Loader";
import { EyeSVG, SlashEyeSVG } from "../components/Svgs";
import { notificationCode, notificationNumber } from "../config/constants";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { loginSchema } from "../services/yup";
const Login = ({ navigation, route }) => {
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const { login, forgotPassword, loading } = useAuth();
    const { storage, setActiveRoute } = useApp();
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const isFocused = useIsFocused();

    const goToIRB = () => {
        navigation.navigate("IRB");
    };

    const goToOtp = (nextRoute) => {
        navigation.navigate("OtpScreen", {
            email: getValues("userEmail"),
            nextRoute,
        });
    };

    const handleLogin = async () => {
        try {
            const userEmail = getValues("userEmail");
            const userPassword = getValues("userPassword");
            const data = await login(userEmail, userPassword);
            if (data && !data.user.emailVerified) {
                Alert.alert(
                    "Email not verified",
                    "Enter otp sent to email id for verification",
                );
                goToOtp("Login");
                return;
            }
            if (data && data.success === false) {
                Alert.alert("Login Failed", data.message);
                return;
            }
            if (data && data?.user?.emailVerified) {
                await storage.setToken(data?.token);
                await storage.setId(String(data?.user?.id));
                const isOnboarded = data.user.isOnboarded;
                await storage.setIsOnboarded(String(isOnboarded));
                registerIndieID(
                    String(data.user.id),
                    notificationNumber,
                    notificationCode,
                );
                if (isOnboarded) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: "MainTabs",
                                    params: { screen: "Home" },
                                },
                            ],
                        }),
                    );
                    setActiveRoute("Home");
                } else {
                    navigation.replace("Onboarding");
                }
            }
        } catch (error) {
            console.log("error", error);
            // Check if error response has status
            if (error.response && error.response.status === 401) {
                alert("Wrong Email or password");
            }
            alert(error.message || "Something went wrong!");
            console.log("Error: ", JSON.stringify(error));
        }
    };

    /**
     * Initiates the process of resetting a forgotten password:
     * - Calls the 'forgotPassword' function to trigger a password reset request for the user's email.
     * - Navigates to the OTP screen with the 'ResetPassword' route after initiating the forgot password flow.
     */
    const handleForgotPassword = async () => {
        const email = getValues("userEmail") || "";
        if (email.trim().length === 0) {
            showMessage({ message: "Enter valid email", type: "danger" });
            return;
        }
        try {
            await forgotPassword(email);
            goToOtp("ResetPassword");
        } catch (err) {
            showMessage({ message: "User not registered!", type: "danger" });
            console.log(err);
        }
    };

    /**
     * Handles navigation to the IRB screen for signup.
     * @function handleSignup
     * @returns {void}
     */
    const handleSignup = () => {
        goToIRB();
        reset({
            userEmail: "",
            userPassword: "",
        });
    };

    useEffect(() => {
        const userEmail = route.params?.email;
        if (userEmail) {
            setValue("userEmail", userEmail);
        }
    }, [isFocused]);

    useEffect(() => {
        if (route?.params) {
            const { email, password } = route.params;
            reset({
                userEmail: email,
                userPassword: password,
            });
        }
    }, [route?.params]);


    return (
        <KeyboardAvoidingView
            style={styles.backgroundContainer}
            behavior="padding"
            enabled
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={styles.container}>
                    <Image
                        source={require("../assets/BurstLogo.png")}
                        style={styles.logoImage}
                    />
                    <Text
                        style={{
                            ...styles.textCurio,
                            fontFamily: "ProtestGuerrilla-Regular",
                        }}
                    >
                        Burst
                    </Text>
                    <View style={styles.textInput}>
                        <View style={styles.inputField}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
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
                                render={({ field: { onChange, value } }) => (
                                    <View style={styles.field}>
                                        <TextInput
                                            style={styles.textContainer}
                                            placeholder="Password"
                                            onChangeText={onChange}
                                            value={value}
                                            secureTextEntry={passwordVisibility}
                                            // keyboardType="visible-password"
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
                    </View>
                    <View style={styles.forgotPasswordButton}>
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotPassword}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading && (
                        <View style={styles.loader}>
                            <Loader />
                        </View>
                    )}
                    {!loading && (
                        <>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleSubmit(handleLogin)}
                            >
                                {/* <Button
                                    title="Login"
                                    onPress={handleSubmit(handleLogin)}
                                    color="#0F4564"
                                /> */}
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: "white",
                                        paddingVertical: 10,
                                    }}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.line} />
                            <TouchableOpacity
                                style={styles.signupButton}
                                onPress={handleSignup}
                            >
                                {/* <Button
                                    title="Signup"
                                    onPress={handleSignup}
                                    color="#0F4564"
                                /> */}
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: theme.colors.lightBlue,
                                        paddingVertical: 10,
                                    }}
                                >
                                    Signup
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    logoImage: {
        width: 180,
        height: 180,
    },
    forgotPasswordButton: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: "10%",
    },
    loader: {
        height: 100,
    },
    forgotPassword: {
        color: theme.colors.lightBlue,
    },
    backgroundContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: 'center',
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: "100%",
    },

    inputField: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
    },

    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        marginBottom: 10,
    },

    textCurio: {
        fontSize: 100,
        bottom: "10%",
        color: "#268EC8",
        marginTop: 30,
        fontStyle: "italic",
        fontFamily: "ProtestGuerrilla-Regular",
    },
    line: {
        height: 1,
        backgroundColor: "lightgray",
        width: "50%",
    },
    loginButton: {
        marginTop: 60,
        backgroundColor: theme.colors.lightBlue,
        borderColor: theme.colors.lightBlue,
        borderWidth: 1,
        width: "100%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    signupButton: {
        borderColor: theme.colors.lightBlue,
        borderWidth: 1,
        width: "100%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    textInput: {
        width: "100%",
        gap: 80,
        color: "white",
    },
    signupView: {
        backgroundColor: "red",
        width: " 100%",
        height: 40,
        bottom: "0%",
    },
    signupButtonView: {
        height: 50,
        width: 100,
        bottom: "0%",
    },
    errorText: {
        marginTop: -5,
        marginBottom: -14,
        color: "red",
        fontSize: 14,
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
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    textContainer: {
        width: "90%",
        height: "100%",
    },
});

export default Login;
