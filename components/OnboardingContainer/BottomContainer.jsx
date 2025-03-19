import React from "react";
import { StyleSheet, View } from "react-native";

import theme from "../../config/theme";
import Button from "../Button";
import { ArrowRightSVG } from "../Svgs";

const BottomContainer = ({ onboardStep, setOnboardStep, endComponent }) => {
    const next = () => {
        setOnboardStep(onboardStep + 1);
    };
    const back = () => {
        if (onboardStep > 0) {
            setOnboardStep(onboardStep - 1);
        }
    };
    const icon = <ArrowRightSVG color={theme.colors.lightBlue} />;
    return (
        <View style={styles.bottomContainer}>
            <View style={styles.btn}>
                <Button
                    label="Back"
                    onPress={back}
                    disabled={onboardStep === 0}
                    startIcon={icon}
                    variant="outlined"
                    color={theme.colors.lightBlue}
                />
            </View>
            {endComponent && endComponent}
            {!endComponent && (
                <View style={styles.btn}>
                    <Button
                        label="Next"
                        onPress={next}
                        endIcon={icon}
                        variant="outlined"
                        color={theme.colors.lightBlue}
                    />
                </View>
            )}
        </View>
    );
};

export default BottomContainer;

const styles = StyleSheet.create({
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "10%",
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    btn: {
        width: 100,
    },
});
