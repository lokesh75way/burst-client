import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import CachedImage from "../CachedImage";
import ImageLoader from "../ImageLoader";

const UserImageViewModal = ({ isVisible, onClose, imageUrl, avatar }) => {
    return (
        <Modal visible={isVisible} onRequestClose={onClose} transparent>
            <TouchableOpacity
                style={styles.modalOverlay}
                onPress={onClose}
                activeOpacity={1}
            >
                <View style={styles.modalContent}>
                    <CachedImage
                        key={avatar}
                        source={{ uri: imageUrl }}
                        style={styles.previewImage}
                        resizeMode="cover"
                        loader={<ImageLoader width={120} height={120} />}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
    },
    modalContent: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        backgroundColor: "#fff",
        width: 250,
        height: 250,
        borderRadius: 125,
    },
});

export default UserImageViewModal;
