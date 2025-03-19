import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, PanResponder, View } from "react-native";

class DoubleClicker extends Component {
    /**
     * Component handling touch-based pan responses.
     */
    constructor() {
        super();

        this.myPanResponder = {};

        this.prevTouchInfo = {
            prevTouchX: 0,
            prevTouchY: 0,
            prevTouchTimeStamp: 0,
        };
        // Bind the handler to the component instance
        this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
    }

    /**
     * Component lifecycle method invoked before mounting.
     * @deprecated Use safer alternatives like componentDidMount
     */
    UNSAFE_UNSAFE_componentWillMount() {
        this.myPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: this.handlePanResponderGrant,
        });
    }

    /**
     * Calculates the distance between two points.
     *
     * @param {number} x0 - X coordinate of the first point.
     * @param {number} y0 - Y coordinate of the first point.
     * @param {number} x1 - X coordinate of the second point.
     * @param {number} y1 - Y coordinate of the second point.
     * @returns {number} The distance between the two points.
     */
    distance(x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }

    /**
     * Checks if the current touch is a double tap based on the provided criteria.
     *
     * @param {number} currentTouchTimeStamp - The timestamp of the current touch event.
     * @param {Object} touchInfo - Object containing touch coordinates.
     * @param {number} touchInfo.x0 - X coordinate of the current touch.
     * @param {number} touchInfo.y0 - Y coordinate of the current touch.
     * @returns {boolean} True if the current touch qualifies as a double tap; otherwise, false.
     */
    isDoubleTap(currentTouchTimeStamp, { x0, y0 }) {
        const { prevTouchX, prevTouchY, prevTouchTimeStamp } =
            this.prevTouchInfo;
        const dt = currentTouchTimeStamp - prevTouchTimeStamp;
        const { delay, radius } = this.props;

        return (
            dt < delay && this.distance(prevTouchX, prevTouchY, x0, y0) < radius
        );
    }

    /**
     * Handles the start of a pan responder gesture.
     *
     * @param {Object} evt - The event object.
     * @param {Object} gestureState - The state of the gesture.
     */
    handlePanResponderGrant(evt, gestureState) {
        const currentTouchTimeStamp = Date.now();

        if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
            this.props.onClick(evt, gestureState);
        }

        this.prevTouchInfo = {
            prevTouchX: gestureState.x0,
            prevTouchY: gestureState.y0,
            prevTouchTimeStamp: currentTouchTimeStamp,
        };
    }

    render() {
        return (
            <View {...this.props} {...this.myPanResponder.panHandlers}>
                {this.props.children}
            </View>
        );
    }
}

DoubleClicker.defaultProps = {
    delay: 300,
    radius: 20,
    onClick: () => Alert.alert("Double Tap Succeed"),
};

DoubleClicker.propTypes = {
    delay: PropTypes.number,
    radius: PropTypes.number,
    onClick: PropTypes.func,
};

module.exports = DoubleClicker;
