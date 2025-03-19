import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import OnboardContainer from ".";
import BottomContainer from "./BottomContainer";
import {
    b2Image1,
    b2Image2,
    b2Image3,
    b2Image4,
    b2Image5,
    b2Image6,
} from "../../assets/onboard";
import { ONBOARD_LIST_TWO } from "../../config/data";
import theme from "../../config/theme";
import Button from "../Button";
import { ArrowRightSVG } from "../Svgs";

const OnboardingTwo = ({ onboardStep, setOnboardStep, swipe }) => {
    const textData = {
        ...ONBOARD_LIST_TWO,
        showText: true,
        showClosedEye: true,
        showStarIcon: true,
    };
    const lastStep = 5;
    const [animationStep, setAnimationStep] = useState(0);

    const next = () => {
        setOnboardStep(onboardStep + 1);
        swipe();
    };

    useEffect(() => {
        const animateStepchange = () => {
            setTimeout(() => {
                setAnimationStep((prev) => prev + 1);
            }, 1500);
        };
        if (onboardStep === 1) {
            if (animationStep < lastStep) {
                animateStepchange();
            }
        }
    }, [animationStep, onboardStep]);
    return (
        <View style={styles.container}>
            {animationStep === 0 && (
                <OnboardContainer source={b2Image1} {...textData} />
            )}
            {animationStep === 1 && (
                <OnboardContainer source={b2Image2} {...textData} />
            )}
            {animationStep === 2 && (
                <OnboardContainer source={b2Image3} {...textData} />
            )}
            {animationStep === 3 && (
                <OnboardContainer source={b2Image4} {...textData} />
            )}
            {animationStep === 4 && (
                <OnboardContainer source={b2Image5} {...textData} />
            )}
            {animationStep === 5 && (
                <OnboardContainer
                    source={b2Image6}
                    showBlueEye
                    backgroundColor="#81CE7B23"
                    {...textData}
                    showClosedEye={false}
                />
            )}
            <BottomContainer
                onboardStep={onboardStep}
                endComponent={
                    animationStep === lastStep && (
                        <View style={styles.endBtnContainer}>
                            <Button
                                label="Next"
                                onPress={next}
                                endIcon={
                                    <ArrowRightSVG
                                        color={theme.colors.lightBlue}
                                    />
                                }
                                variant="outlined"
                                color={theme.colors.lightBlue}
                            />
                        </View>
                    )
                }
            />
        </View>
    );
};

export default OnboardingTwo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    bottomContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        paddingVertical: 5,
    },
    button: {
        borderWidth: 2,
        borderColor: "#0091E2",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 3,
        position: "absolute",
        right: "5%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
    },
    buttonText: {
        color: "#0091E2",
        fontSize: 20,
        fontWeight: "600",
    },
    rightIcon: {
        width: 10,
        height: 10,
        marginTop: 2,
    },
    endBtnContainer: {
        width: 100,
    },
});
