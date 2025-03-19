import React, { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

import { onboardTap1, onboardTap2 } from "../../assets/onboard";

const MessageBox = ({ box }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);
    // const boxStyles =
    //     box === 0 ? styles.box0 : box === 1 ? styles.box1 : styles.box2;
    return (
        <Animated.View style={styles.animatedView}>
            {box === 0 && (
                <View style={styles.view0}>
                    <Image source={onboardTap1} style={styles.image0} />
                </View>
            )}
            {box === 1 && (
                <View style={styles.view1}>
                    <Image source={onboardTap2} style={styles.image1} />
                </View>
            )}
        </Animated.View>
    );
};

export default MessageBox;

const styles = StyleSheet.create({
    box: {
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    view0: {
        display: "flex",
        justifyContent: "center",
    },
    image0: {
        width: 380,
        resizeMode: "contain",
    },
    view1: {
        display: "flex",
        justifyContent: "center",
    },
    image1: {
        width: 380,
        resizeMode: "contain",
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        color: "#000",
    },
    box0: {
        position: "absolute",
        bottom: "40%",
    },
    box1: {
        width: "50%",
        position: "absolute",
        bottom: "25%",
    },
    box2: {
        width: "60%",
        position: "absolute",
        bottom: "55%",
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 35,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        position: "absolute",
        bottom: -25,
        right: 15,
        transform: [{ rotate: "150deg" }],
        borderBottomColor: "white",
    },
});
