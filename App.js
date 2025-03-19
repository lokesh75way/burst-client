import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import registerNNPushToken from "native-notify";
import React from "react";
import { ActivityIndicator } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import FlashMessage from "react-native-flash-message";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
import Tabs from "./components/Tabs";
import { notificationCode, notificationNumber } from "./config/constants";
import useApp from "./hooks/useApp";
import AppProvider from "./providers/AppProvider";
import AddUsers from "./screens/AddUser";
import ChannelDetails from "./screens/ChannelDetails";
import Followers from "./screens/Followers";
import Following from "./screens/Following";
import GetStart from "./screens/GetStart";
import Home from "./screens/Home";
import IRB from "./screens/IRB";
import IndieNotification from "./screens/IndieNotification";
import Invitations from "./screens/Invitations";
import Login from "./screens/Login";
import Notification from "./screens/Notification";
import Onboarding from "./screens/Onboarding";
import OtpScreen from "./screens/OtpScreen";
import PostDetail from "./screens/PostDetail";
import PostScreen from "./screens/PostScreen";
import Privacy from "./screens/Privacy";
import Profile from "./screens/Profile";
import ResetPassword from "./screens/ResetPassword";
import SendInvitation from "./screens/SendInvitation";
import SignUp from "./screens/Signup";
import SinglePost from "./screens/SinglePost";
import UserPage from "./screens/UserPage";
import YourTeam from "./screens/YourTeam";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
const loadFonts = async () => {
    await Font.loadAsync({
        "Handjet-VariableFont_ELGR,ELSH,wght": require("./assets/fonts/Handjet-VariableFont_ELGR,ELSH,wght.ttf"),
        "NerkoOne-Regular": require("./assets/fonts/NerkoOne-Regular.ttf"),
        "Pacifico-Regular": require("./assets/fonts/Pacifico-Regular.ttf"),
        "PlaywriteCU-VariableFont_wght": require("./assets/fonts/PlaywriteCU-VariableFont_wght.ttf"),
        "ProtestGuerrilla-Regular": require("./assets/fonts/ProtestGuerrilla-Regular.ttf"),
    });
};
loadFonts();

function MainTabs() {
    return (
        <Tab.Navigator tabBar={(props) => <Tabs {...props} />}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="YourTeam"
                component={YourTeam}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Post"
                component={PostScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Invitations"
                component={Invitations}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="SendInvitation"
                component={SendInvitation}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="IndieNotification"
                component={IndieNotification}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Followers"
                component={Followers}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Following"
                component={Following}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="UserPage"
                component={UserPage}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}

export default function APP() {
    registerNNPushToken(notificationNumber, notificationCode);
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                    <AppProvider>
                        <NavigationContainer>
                            <NavigationStacks />
                        </NavigationContainer>
                        <FlashMessage
                            position="top"
                            titleStyle={{
                                fontSize: 18,
                                textAlign: "center",
                                fontWeight: 600,
                            }}
                        />
                    </AppProvider>
                </ErrorBoundary>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
const PostDetailStackScreen = () => {
    return (
        <Stack.Navigator initialRouteName="PostDetail">
            <Stack.Screen
                name="PostDetail"
                component={PostDetail}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const NavigationStacks = () => {
    const { storage } = useApp();
    // need to show a loading UI
    if (storage.loading) return <ActivityIndicator />;

    const isLoggedIn = Boolean(storage.token);
    const nextTab = isLoggedIn
        ? storage.isOnboarded === "false"
            ? "Onboarding"
            : "MainTabs"
        : "Login";
    return (
        <Stack.Navigator initialRouteName={isLoggedIn ? nextTab : "Login"}>
            <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PostDetailStack"
                component={PostDetailStackScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Tabs"
                component={Tabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OtpScreen"
                component={OtpScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="IRB"
                component={IRB}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Privacy"
                component={Privacy}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="GetStart"
                component={GetStart}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserPage"
                component={UserPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddUsers"
                component={AddUsers}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SinglePost"
                component={SinglePost}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChannelDetails"
                component={ChannelDetails}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};
