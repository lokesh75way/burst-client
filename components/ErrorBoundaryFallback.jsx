import { Button, Text, View } from "react-native";

/**
 * Error fallback component to display when an error occurs within an ErrorBoundary.
 *
 * @param {Object} props - The component's props.
 * @param {Error} props.error - The error object caught by the ErrorBoundary.
 * @param {Function} props.resetError - Function to reset the error state or handle retry action.
 * @returns {JSX.Element} A component to display error information and a retry button.
 */
const ErrorBoundaryFallback = (props) => {
    const { error, resetError } = props;
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Text style={{ fontSize: 25, marginBottom: 10 }}>
                Something happened!
            </Text>
            <Text>{error.toString()}</Text>
            <Button onPress={resetError} title="Try again" />
        </View>
    );
};

export default ErrorBoundaryFallback;
