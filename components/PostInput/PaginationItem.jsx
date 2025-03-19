import { StyleSheet, View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

import theme from "../../config/theme";

const PaginationItem = (props) => {
    const { animValue, index, length } = props;
    const width = 8;
    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP,
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View style={styles.dot}>
            <Animated.View style={[styles.activeDot, animStyle]} />
        </View>
    );
};
export default PaginationItem;
const styles = StyleSheet.create({
    dot: {
        backgroundColor: "#cccccc",
        width: 8,
        height: 8,
        borderRadius: 50,
        overflow: "hidden",
    },
    activeDot: {
        borderRadius: 50,
        backgroundColor: theme.colors.lightBlue,
        flex: 1,
    },
});
