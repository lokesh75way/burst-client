import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import OnboardContainer from ".";
import BottomContainer from "./BottomContainer";
import {
    b1Image1,
    b1Image2,
    b1Image3,
    b1Image4,
    b1Image5,
    b1Image6,
} from "../../assets/onboard";
import { ONBOARD_LIST_ONE } from "../../config/data";
import theme from "../../config/theme";
import Button from "../Button";
import { ArrowRightSVG } from "../Svgs";
const OnboardingOne = ({ onboardStep, setOnboardStep, swipe }) => {
    const textData = ONBOARD_LIST_ONE;
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
        if (onboardStep == 0) {
            if (animationStep < lastStep) {
                animateStepchange();
            }
        }
    }, [animationStep, onboardStep]);
    return (
        <View style={styles.container}>
            {animationStep === 0 && (
                <OnboardContainer
                    source={b1Image1}
                    isInitialImage
                    {...textData}
                />
            )}
            {animationStep === 1 && (
                <OnboardContainer source={b1Image2} {...textData} />
            )}
            {animationStep === 2 && (
                <OnboardContainer source={b1Image3} {...textData} />
            )}
            {animationStep === 3 && (
                <OnboardContainer source={b1Image4} showText {...textData} />
            )}
            {animationStep === 4 && (
                <OnboardContainer source={b1Image5} showText {...textData} />
            )}
            {animationStep === 5 && (
                <OnboardContainer
                    source={b1Image6}
                    showText
                    showClosedEye
                    backgroundColor="#D9D9D923"
                    {...textData}
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

export default OnboardingOne;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    endBtnContainer: {
        width: 100,
    },
});
