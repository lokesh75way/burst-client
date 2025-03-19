import { FlatList, StyleSheet, View } from "react-native";

import EmojiCell from "./EmojiCell";
/**
 * Component rendering a list of emojis and their variants.
 * @param {object} props - Props for the Emojis component.
 * @param {object} props.emoji - The main emoji object.
 * @param {Function} props.onEmojiSelected - Callback function when an emoji is selected.
 * @returns {JSX.Element} JSX for the Emojis component.
 */
const Emojis = (props) => {
    const { emoji, onEmojiSelected } = props;
    const { skin_variations } = emoji;
    const variants = Object.keys(skin_variations).map(
        (skin) => skin_variations[skin],
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={[].concat(emoji, variants)}
                renderItem={({ item }) => (
                    <EmojiCell
                        key={item.key}
                        emoji={item}
                        colSize={64}
                        onPress={() => onEmojiSelected(item)}
                    />
                )}
                keyExtractor={(item) => item.unified}
                horizontal={false}
                numColumns={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 240,
        height: 176,
        padding: 24,
        borderRadius: 24,
    },
});

export default Emojis;
