import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import OnboardUser from "../components/OnboardingContainer/OnboardUser";
import theme from "../config/theme";

const Onboarding = () => {
    const [onboardStep, setOnboardStep] = useState(0);
    const swiperRef = useRef(null);

    const swipe = () => {
        swiperRef.current.scrollBy(onboardStep + 1);
    };
    const stepsProps = {
        onboardStep,
        setOnboardStep,
        swipe,
    };

    return (
        <SafeAreaView style={styles.container}>
            <OnboardUser {...stepsProps} />
        </SafeAreaView>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: theme.colors.white,
        // width: "100%",
        flex: 1,
    },
});
