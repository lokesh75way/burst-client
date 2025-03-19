// Loader.jsx

import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Component representing a Loader on screens.
 *
 * @returns {JSX.Element} A component to show while loading
 */
export default function Loader(props) {
    const { color = "#000", size = "large" } = props;
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
});
