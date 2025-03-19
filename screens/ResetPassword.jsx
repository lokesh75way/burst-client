import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import useAuth from "../hooks/useAuth";
import { resetSchema } from "../services/yup";

const ResetPassword = ({ navigation, route }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetSchema),
    });
    const { resetPassword } = useAuth();
    const email = route.params.email;

    /**
     * Handles the submission to reset the user's password:
     * - Calls the 'resetPassword' function to reset the password for the provided email.
     * - Navigates to the 'Login' screen after successfully resetting the password.
     */
    const handleReset = async (formData) => {
        const { userPassword } = formData;
        await resetPassword(email, userPassword);
        navigation.navigate("Login");
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
                    <Text style={styles.textCurio}>Burst</Text>
                    <View style={styles.textInput}>
                        <View style={styles.inputField}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry
                                        textContentType="password"
                                        keyboardType="visible-password"
                                    />
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
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry
                                        textContentType="password"
                                        keyboardType="visible-password"
                                    />
                                )}
                                name="confirmPassword"
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.loginButton}>
                        <Button
                            title="Submit"
                            onPress={handleSubmit(handleReset)}
                        />
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

    inputField: {
        width: "100%",
        marginBottom: 20,
        bottom: "20%",
    },

    input: {
        borderColor: "gray",
        borderWidth: 1,
        height: 40,
        paddingLeft: 10,
        borderRadius: 10,
    },

    textCurio: {
        fontSize: 100,
        bottom: "10%",
        color: "skyblue",
    },

    loginButton: {
        bottom: "3%",
    },

    textInput: {
        width: "100%",
    },

    errorText: {
        marginBottom: -14,
        color: "red",
        fontSize: 14,
    },
});

export default ResetPassword;
