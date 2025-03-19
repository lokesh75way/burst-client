import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

import UserCheck from "../assets/icons/UserCheck.png";
import Loader from "../components/Loader";
import { ArrowLeftSVG } from "../components/Svgs";
import theme from "../config/theme";
import useInvitation from "../hooks/useInvitation";
import { inviteSchema } from "../services/yup";

const SendInvitation = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { postEmailInvitation } = useInvitation();
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(inviteSchema),
    });
    useFocusEffect(
        useCallback(() => {
            reset();
        }, [reset]),
    );
    const onSubmit = async () => {
        try {
            setLoading(true);
            const res = await postEmailInvitation(getValues("inviteeEmail"));
            if (res && res.success === false) {
                Alert.alert(res.message);
                reset();
                return;
            }
            showMessage({ message: "Invitation sent!", type: "success" });
            reset();
        } catch (err) {
            console.log("Error:- ", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <View style={styles.screenHeader}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Profile");
                        }}
                        style={styles.backButton}
                    >
                        <ArrowLeftSVG />
                    </TouchableOpacity>
                    <Text style={styles.title}>Invite Your Friends</Text>
                </View>
                <Image source={UserCheck} style={styles.userCheck} />
                <Text style={styles.text}>
                    Share your code or send an invite email to invite your
                    friends and join their team!
                </Text>
                <View style={styles.inviteContainer}>
                    <Text style={styles.inviteeText}>Invitee’s email</Text>
                    <Controller
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inviteBox}
                                value={value}
                                onChangeText={onChange}
                                cursorColor="#58B2E3"
                                placeholder="e.g. invitee@email.com"
                                placeholderTextColor="#B7B7B7"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                textContentType="emailAddress"
                                autoFocus
                            />
                        )}
                        name="inviteeEmail"
                    />
                    {errors.inviteeEmail && (
                        <Text style={styles.errorText}>
                            {errors.inviteeEmail.message}
                        </Text>
                    )}

                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.btn}
                    >
                        {loading ? (
                            <Loader size="small" color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>
                                Send invite email
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SendInvitation;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        color: "#000",
    },
    screenHeader: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 20,
        width: "100%",
    },
    backButton: {
        width: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    userCheck: {
        height: 80,
        width: 80,
        marginVertical: 20,
    },
    text: {
        fontSize: 16,
        color: "#000",
        fontWeight: "600",
        textAlign: "center",
        marginHorizontal: 20,
    },
    inviteContainer: {
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 50,
    },
    inviteeText: {
        color: "#747474",
        fontWeight: "700",
        fontSize: 16,
    },
    inviteBox: {
        borderWidth: 2,
        borderColor: "#959696",
        borderRadius: 6,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        // textAlign: "center",
        fontSize: 18,
    },
    btn: {
        width: "100%",
        borderRadius: 6,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        backgroundColor: "#58B2E3",
        height: 52,
    },
    btnText: {
        color: theme.colors.white,
        fontSize: 20,
        fontWeight: "700",
    },
    errorText: {
        fontSize: 14,
        color: "red",
        textAlign: "left",
        marginBottom: 5,
    },
});
