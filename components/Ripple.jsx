import React, { Component } from "react";
import { Animated, StyleSheet, View } from "react-native";

/**
 * Component that manages and displays animated views based on specified conditions and state.
 * @class AnimatedComponent
 * @extends React.Component
 */
class Ripple extends Component {
    state = {
        animated: new Animated.Value(0),
        opacityA: new Animated.Value(1),
        animated2: new Animated.Value(0),
        opacityA2: new Animated.Value(1),
        animationStopped: false,
    };

    /**
     * Handles the animation based on the current state.
     * If animationStopped is true, initiates the animation.
     * @memberof AnimatedComponent
     * @method handleAnimation
     */
    handleAnimation = () => {
        const { animationStopped } = this.state;

        if (animationStopped) {
            this.startAnimation();
        }
    };

    componentDidMount() {
        this.startAnimation();
    }

    /**
     * Starts the specified animation.
     * @memberof AnimatedComponent
     * @method startAnimation
     */
    startAnimation = () => {
        const { animated, opacityA, animated2, opacityA2 } = this.state;

        const animation = Animated.stagger(600, [
            Animated.loop(
                Animated.parallel([
                    Animated.timing(animated, {
                        toValue: 3,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityA, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
            ),

            Animated.loop(
                Animated.parallel([
                    Animated.timing(animated2, {
                        toValue: 3,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityA2, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
            ),
        ]);

        this.setState({ animationStopped: false });

        animation.start(() => {
            // 在动画完成后，延迟3秒后停止动画
            setTimeout(() => {
                if (!this.state.animationStopped) {
                    animation.stop();
                    this.setState({ animationStopped: true });
                }
            }, 2000);
        });
    };

    /**
     * Renders an animated view based on the state and props.
     * @param {Object} props - The component props.
     * @param {number} props.number - The number used to determine background colors.
     * @returns {JSX.Element} An animated view component.
     */
    render() {
        const { animated, opacityA, animated2, opacityA2 } = this.state;
        const { number } = this.props;
        // console.log("number: "+number);
        let backgroundColor1 = "rgba( 0, 205, 205, 0.7 )";
        let backgroundColor2 = "rgba( 0, 255, 0, 0.7 )";
        if (number >= 100 && number < 1000) {
            backgroundColor1 = "rgba( 30, 144, 255, 0.7 )";
            backgroundColor2 = "rgba( 0, 0, 250, 0.6 )";
        } else if (number >= 1000) {
            // TODO
            backgroundColor1 = "rgba( 255, 106, 106, 0.7 )";
            backgroundColor2 = "rgba( 255, 130, 71, 0.6 )";
        }

        return (
            <View style={styles.container}>
                <Animated.View
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: backgroundColor1,
                        opacity: opacityA,
                        transform: [
                            {
                                scale: animated,
                            },
                        ],
                    }}
                >
                    <Animated.View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: backgroundColor2,
                            opacity: opacityA2,
                            transform: [
                                {
                                    scale: animated2,
                                },
                            ],
                        }}
                    />
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bottom: "50%",
        zIndex: 2,
    },
});

export default Ripple;
