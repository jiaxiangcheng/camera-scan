import React, { useState, useContext, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Alert } from "react-native";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    Modal,
    Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";

// Components
import ClassicButton from "../../sharedComponents/ClassicButton";
import ProductCard from "./components/ProductCard";

// Contexts
import { API } from "../../context/Api";
import { Utils } from "../../context/Utils";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../../themeColors/ThemeColors";

export default function Home(props) {
    // context
    const { checkIfProductExists, getDummyData } = useContext(API);
    const { actuatedNormalize, changeScreenOrientation } = useContext(Utils);

    const [hasPermission, setHasPermission] = useState(null);
    const [cameraOpened, setCameraOpened] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [contentScanned, setContentScanned] = useState(false);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [flasState, setFlasState] = useState(Camera.Constants.FlashMode.off);

    const squareOpacity = useRef(new Animated.Value(1)).current;
    const squareScale = useRef(new Animated.Value(1)).current;
    const squareColor = useRef("white");
    const dummyData = useRef(null);

    // detect current theme
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }
    const themeStatusstyle = colorScheme === "light" ? "dark" : "light";

    useFocusEffect(
        React.useCallback(() => {
            props.navigation.setOptions({
                title: "Sample App",
                headerTitleStyle: { alignSelf: "center" },
                headerRight: () => <TouchableOpacity></TouchableOpacity>,
                headerLeft: () => <TouchableOpacity></TouchableOpacity>,
            });
            changeScreenOrientation("portrait");
        }, [])
    );

    const startAnimateSquare = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(squareScale, {
                    toValue: 1.25,
                    duration: 500,
                    ease: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(squareOpacity, {
                    toValue: 0,
                    duration: 500,
                    ease: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(squareOpacity, {
                    toValue: 1,
                    duration: 500,
                    ease: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(squareScale, {
                    toValue: 1,
                    duration: 800,
                    ease: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const openCamera = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
        if (status === "granted") {
            if (!cameraOpened) {
                startAnimateSquare();
                setCameraOpened(true);
            }
        }
    };

    const barCodeScanSucceed = async (info) => {
        var scannedCode = info.data;
        if (!contentScanned) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Handle the animations
            Animated.timing(squareScale).stop();
            Animated.timing(squareOpacity).stop();
            Animated.timing(squareOpacity, {
                toValue: 1,
                duration: 0,
                ease: Easing.linear,
                useNativeDriver: true,
            }).start();

            // Check if product exists
            var exist = await checkIfProductExists(scannedCode);
            if (exist) {
                squareColor.current = "#05DA6B";
                setContentScanned(true);
                // Get the dummy data of the scanned code
                dummyData.current = await getDummyData(scannedCode);
                // Delay some time to mimic the request
                setTimeout(function () {
                    setModalVisible(true);
                    squareColor.current = "white";
                }, 1000);
            } else {
                squareColor.current = "red";
                setContentScanned(true);

                Alert.alert(
                    `${scannedCode} not found in our database`,
                    "Scan another code please",
                    [
                        {
                            text: "Try again",
                            onPress: () => {
                                squareColor.current = "white";
                                setContentScanned(true);
                                setTimeout(function () {
                                    // set a delay before the next scan
                                    setContentScanned(false);
                                }, 1000);
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const modalStyleSheet = StyleSheet.create({
        centeredView: {
            flex: 1,
        },
    });

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
        cameraToolBtn: {
            height: 30,
            width: 80,
            marginBottom: 30,
            marginHorizontal: 30,
        },
        camera: {
            flex: 1,
            width: "100%",
        },
        infoView: {
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
        },
        squareContainer: {
            flex: 3,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
        bottomBtnsContainer: {
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
        },
        infoText: {
            fontSize: actuatedNormalize(16),
            textAlign: "center",
            color: "white",
            borderRadius: 15,
            padding: 15,
        },
        infoViewBackground: {
            borderRadius: 15,
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.infoBackground
                    : darkColors.infoBackground,
        },
    });

    return (
        <React.Fragment>
            <StatusBar style={themeStatusstyle} />
            <View style={styleSheet.container}>
                {cameraOpened == true ? (
                    <Camera
                        style={styleSheet.camera}
                        type={cameraType}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        flashMode={flasState}
                        onBarCodeScanned={barCodeScanSucceed}
                    >
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                        >
                            <ProductCard
                                style={modalStyleSheet.centeredView}
                                productInfo={dummyData.current}
                                closeAction={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    setModalVisible(!modalVisible);
                                    setTimeout(function () {
                                        // set a delay before the next scan
                                        setContentScanned(false);
                                    }, 1000);
                                    startAnimateSquare();
                                }}
                            ></ProductCard>
                        </Modal>

                        <View style={styleSheet.infoView}>
                            <View style={styleSheet.infoViewBackground}>
                                <Text style={styleSheet.infoText}>
                                    Scan a QR or Bar code
                                </Text>
                            </View>
                        </View>

                        <Animated.View
                            style={[
                                styleSheet.squareContainer,
                                {
                                    opacity: squareOpacity,
                                    transform: [
                                        {
                                            scale: squareScale,
                                        },
                                    ],
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

                        <View style={styleSheet.bottomBtnsContainer}>
                            <ClassicButton
                                title="Flash"
                                style={styleSheet.cameraToolBtn}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
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
                                style={styleSheet.cameraToolBtn}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    setCameraType(
                                        cameraType ===
                                            Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }}
                            ></ClassicButton>
                            <ClassicButton
                                title="Exit"
                                style={styleSheet.cameraToolBtn}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    setCameraOpened(false);
                                    setContentScanned(false);
                                    setFlasState(
                                        Camera.Constants.FlashMode.off
                                    );
                                    setCameraType(Camera.Constants.Type.back);
                                    Animated.timing(squareScale).stop();
                                    Animated.timing(squareOpacity).stop();
                                }}
                            ></ClassicButton>
                        </View>
                    </Camera>
                ) : (
                    <ClassicButton
                        onPress={openCamera}
                        style={styleSheet.cameraToolBtn}
                        title="Scan"
                    ></ClassicButton>
                )}
            </View>
        </React.Fragment>
    );
}
