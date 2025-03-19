import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

import { Button } from "react-native-elements";
import { showMessage } from "react-native-flash-message";
import Loader from "../components/Loader";
import theme from "../config/theme";
import useAuth from "../hooks/useAuth";

const OtpScreen = ({ navigation, route }) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { verifyOtp, resendOtp } = useAuth();
    const email = route.params?.email;
    const nextRoute = route.params?.nextRoute;
    const [resendTimer, setResendTimer] = useState(60);
    const [disableResend, setDisableResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    /**
     * Handles the submission of OTP verification:
     * - Calls the 'verifyOtp' function to verify the OTP for the provided email.
     * - Displays an 'Email Verified' alert.
     * - Navigates to the next route with the given parameters after successful OTP verification.
     */
    const handleSubmit = async () => {
        console.log("handle submit");
        if (!otp.trim().length) {
            setError("Enter 6 digit OTP");
            return;
        }
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            Alert.alert("Email Verified");
            navigation.navigate(nextRoute, route.params);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Wrong Otp");
            }
        }
        setLoading(false);
    };
    const resetError = () => {
        if (error) {
            setError(null);
        }
    };

    const startResendTimer = () => {
        setDisableResend(true);
        let timer = setInterval(() => {
            setResendTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            setDisableResend(false);
            setResendTimer(60);
        }, 60000);
    };

    useEffect(() => {
        startResendTimer();
    }, []);

    useEffect(() => {
        if (resendTimer === 0) {
            setDisableResend(false);
        }
    }, [resendTimer]);

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const resp = await resendOtp(email);
            showMessage({ message: "OTP resent", type: "success" });
            startResendTimer();
        } catch (error) {
            showMessage({
                message: "Failed to resend OTP, Please try again",
                type: "danger",
            });
            console.log(error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.backgroundContainer}
            behavior="height"
            enabled
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={styles.container}>
                    {/* <Text style={styles.textCurio}>Burst</Text> */}
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
                    <Text style={styles.labelText}>
                        Please check your email for one-time code, and enter it
                        below for verification
                    </Text>
                    <View style={styles.textInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter one-time code from email"
                            onChangeText={setOtp}
                            value={otp}
                            maxLength={6}
                            textContentType="oneTimeCode"
                            onChange={resetError}
                            onSubmitEditing={handleSubmit}
                            keyboardType="number-pad"
                        />
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>

                    <TouchableOpacity
                        style={{
                            ...styles.loginButton,
                            backgroundColor: loading
                                ? "#A6A6A6"
                                : theme.colors.lightBlue,
                        }}
                        onPress={!loading ? handleSubmit : () => {}}
                    >
                        {!loading && (
                            <Text style={styles.submitText}>Submit</Text>
                        )}
                        {loading && (
                            <View style={{ height: 20 }}>
                                <Loader size="small" color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 20,
                            alignSelf: "flex-end",
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.grey2,
                                marginRight: 10,
                            }}
                        >
                            Didn’t receive one-time code?
                        </Text>
                        {isResending ? (
                            <ActivityIndicator
                                color={theme.colors.lightBlue}
                                size={20}
                            />
                        ) : (
                            <Button
                                title={`Resend ${
                                    disableResend
                                        ? `in ${resendTimer}s`
                                        : "Code"
                                }`}
                                radius={"xl"}
                                titleStyle={{
                                    fontSize: 12,
                                    color: theme.colors.white,
                                }}
                                buttonStyle={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 10,
                                    backgroundColor: theme.colors.lightBlue,
                                    borderRadius: 8,
                                }}
                                disabled={disableResend}
                                onPress={handleResendCode}
                            />
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        resizeMode: "cover",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    input: {
        width: "100%",
        height: 50,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        bottom: "20%",
        fontSize: 16,
    },

    textCurio: {
        fontSize: 100,
        // bottom: "7%",
        marginBottom: 30,
        color: "skyblue",
    },
    loginButton: {
        width: "100%",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        width: "100%",
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        lineHeight: 14,
    },
    submitText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    labelText: {
        width: "100%",
        marginBottom: 20,
        fontSize: 16,
        color: "#373737",
        fontWeight: "600",
        textAlign: "center",
    },
    textCurio: {
        fontSize: 100,
        bottom: "10%",
        color: "#268EC8",
        marginTop: 30,
        fontStyle: "italic",
        fontFamily: "ProtestGuerrilla-Regular",
    },
    logoImage: {
        width: 180,
        height: 180,
    },
});

export default OtpScreen;
