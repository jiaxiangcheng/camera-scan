import React, { useState, useContext, useRef } from "react";
import { Alert } from "react-native";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import * as Haptics from "expo-haptics";

import { useFocusEffect } from "@react-navigation/native";

// Components
import ClassicButton from "../../sharedComponents/ClassicButton";

// Contexts
import { API } from "../../context/Api";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../../themeColors/ThemeColors";

export default function Home(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraOpened, setCameraOpened] = useState(false);
    const [flasState, setFlasState] = useState(Camera.Constants.FlashMode.off);
    const [contentScanned, setContentScanned] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const squareOpacity = useRef(new Animated.Value(1)).current;
    const squareColor = useRef("white");

    // context
    const { checkIfProductExists } = useContext(API);

    // detect current theme
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }
    const themeStatusstyle = colorScheme === "light" ? "dark" : "light";

    useFocusEffect(
        React.useCallback(() => {
            props.navigation.setOptions({
                headerTitleStyle: { alignSelf: "center" },
                headerRight: () => <TouchableOpacity></TouchableOpacity>,
                headerLeft: () => <TouchableOpacity></TouchableOpacity>,
            });

            Animated.loop(
                Animated.sequence([
                    Animated.timing(squareOpacity, {
                        toValue: 0,
                        duration: 1000,
                        ease: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(squareOpacity, {
                        toValue: 1,
                        duration: 1000,
                        ease: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, [])
    );

    const openCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
        if (status === "granted") {
            if (!cameraOpened) {
                setCameraOpened(true);
            }
        }
    };

    const barCodeScanSucceed = async (info) => {
        if (!contentScanned) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Animated.timing(squareOpacity).stop();
            Animated.timing(squareOpacity, {
                toValue: 1,
                duration: 0,
                ease: Easing.linear,
                useNativeDriver: true,
            }).start();

            squareColor.current = "green";
            setContentScanned(true);

            // Calling API
            var exist = await checkIfProductExists(info.data);
            console.log(exist);
            if (exist) {
                // Delay some time to mimic the request
                setTimeout(function () {
                    props.navigation.navigate("ProductDetails", {
                        content: info,
                    });
                    squareColor.current = "white";

                    setTimeout(function () {
                        setContentScanned(false);
                    }, 1000);
                }, 1000);
            } else {
                Alert.alert(
                    `Product with EAN: ${info.data} not find :(`,
                    "Scan another product please",
                    [
                        {
                            text: "Try again",
                            onPress: () => {
                                squareColor.current = "white";
                                setContentScanned(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const styleSheet = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.background
                    : darkColors.background,
        },
        button: {
            backgroundColor: "red",
            height: 30,
            width: 70,
            marginBottom: 30,
            marginHorizontal: 30,
        },
        camera: {
            flex: 1,
            width: "100%",
        },
        squareContainer: {
            flex: 8,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            // backgroundColor: "blue",
        },
        buttonContainer: {
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
            // backgroundColor: "green",
        },
        text: {
            fontSize: 10,
            textAlign: "center",
            color: "white",
        },
    });

    return (
        <React.Fragment>
            <StatusBar style={themeStatusstyle} />
            <View style={styleSheet.container}>
                {cameraOpened == true ? (
                    <Camera
                        style={styleSheet.camera}
                        type={type}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        flashMode={flasState}
                        onBarCodeScanned={barCodeScanSucceed}
                    >
                        <Animated.View
                            style={[
                                styleSheet.squareContainer,
                                {
                                    opacity: squareOpacity,
                                },
                            ]}
                        >
                            <View>
                                <Image
                                    source={require("../../resources/corners.png")}
                                    style={[
                                        {
                                            width: 300,
                                            height: 300,
                                            tintColor: squareColor.current,
                                        },
                                    ]}
                                ></Image>
                            </View>
                        </Animated.View>

                        <View style={styleSheet.buttonContainer}>
                            <ClassicButton
                                title="Flash"
                                style={styleSheet.button}
                                onPress={() => {
                                    setFlasState(
                                        flasState ===
                                            Camera.Constants.FlashMode.torch
                                            ? Camera.Constants.FlashMode.off
                                            : Camera.Constants.FlashMode.torch
                                    );
                                }}
                            ></ClassicButton>
                            <ClassicButton
                                title="Flip"
                                style={styleSheet.button}
                                onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }}
                            ></ClassicButton>
                            <ClassicButton
                                title="Exit"
                                style={styleSheet.button}
                                onPress={() => {
                                    setCameraOpened(false);
                                    setContentScanned(false);
                                    setFlasState(
                                        Camera.Constants.FlashMode.off
                                    );
                                }}
                            ></ClassicButton>
                        </View>
                    </Camera>
                ) : (
                    <ClassicButton
                        onPress={openCamera}
                        style={styleSheet.button}
                        title="Scan"
                    ></ClassicButton>
                )}
            </View>
        </React.Fragment>
    );
}
