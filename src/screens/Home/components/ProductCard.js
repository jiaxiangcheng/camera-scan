import React, { useRef, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    Dimensions,
    Image,
} from "react-native";
import * as Haptics from "expo-haptics";
import MapView, { Marker } from "react-native-maps";
import GestureRecognizer, {
    swipeDirections,
} from "react-native-swipe-gestures";
import * as Progress from "react-native-progress";

// Context
import { Utils } from "../../../context/Utils";

// Components
import ClassicButton from "../../../sharedComponents/ClassicButton";
import Punctuation from "./Punctuation";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../../../themeColors/ThemeColors";

export default function ProductCard({ productInfo, closeAction }) {
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }

    const windowWidth = Dimensions.get("window").width;

    // context
    const { actuatedNormalize } = useContext(Utils);

    const [progressIndicator, setProgressIndicator] = useState(0);

    const reachedTop = useRef(true);
    const offset = useRef(0);

    // console.log(productInfo.results[0]);
    var data = productInfo.results[0];

    var avatarURL = data.picture.large;
    var email = data.email;
    var birth = data.dob.date;
    var name = `${data.name.first} ${data.name.last}`;
    var phone = data.phone;
    var street = `${data.location.street.name} ${data.location.street.number}`;
    var cityZipCode = `${data.location.city} ${data.location.postcode}`;
    var latitude = Number(data.location.coordinates.latitude);
    var longitude = Number(data.location.coordinates.longitude);

    useFocusEffect(
        React.useCallback(() => {
            delayLoading();
        }, [])
    );

    const handleScroll = (event) => {
        var currentOffset = event.nativeEvent.contentOffset.y;
        if (currentOffset != offset.current) {
            offset.current = currentOffset;
            if (offset.current == 0) {
                reachedTop.current = true;
            } else {
                reachedTop.current = false;
            }
        }
    };

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    const config2 = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    const onSwipeDown = (gestureState) => {
        if (reachedTop.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            closeAction();
        }
    };

    const delayLoading = () => {
        setTimeout(function () {
            setProgressIndicator(0.5);
        }, 2000);
    };

    // ---------------------------------------Styles---------------------------------------------
    const modalStyle = StyleSheet.create({
        modalView: {
            flex: 1,
            flexDirection: "column",
            width: "100%",
            marginTop: "25%",
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.background
                    : darkColors.background,
        },
        verticalScrollView: {
            flex: 1,
            width: "100%",
        },
        verticalContainer: {
            flex: 1,
            flexDirection: "column",
            width: "100%",
            height: 300,
        },
    });

    const basicInfoStyle = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            width: "95%",
            height: 150,
            marginLeft: "2.5%",
            marginVertical: 10,
            borderRadius: 15,
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.background
                    : darkColors.background,
            justifyContent: "center",
            alignItems: "center",
        },
        leftContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: 15,
        },
        rightContainer: {
            flex: 2.5,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
        },
        text: {
            marginLeft: 15,
            marginVertical: 5,
            fontSize: actuatedNormalize(12),
            color:
                colorScheme == "light"
                    ? lightColors.textMain
                    : darkColors.textMain,
        },
    });

    const mapStyle = StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            height: 300,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 25,
        },
        text: {
            marginVertical: 20,
            fontWeight: "bold",
            fontSize: actuatedNormalize(16),
            color:
                colorScheme == "light"
                    ? lightColors.textMain
                    : darkColors.textMain,
        },
    });

    const topContainerStyle = StyleSheet.create({
        container: {
            flex: 0.1,
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-end",
        },
        button: {
            height: 30,
            width: 30,
            marginRight: 30,
        },
        indicatorBar: {
            width: 50,
            height: 3,
            backgroundColor: "grey",
            borderRadius: 3,
            alignSelf: "center",
        },
    });

    const moreInfoStyle = StyleSheet.create({
        container: {
            flex: 1,
            width: "95%",
            marginLeft: "2.5%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            margin: 25,
        },
        punctuationContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
    });

    return (
        <View style={modalStyle.modalView}>
            <GestureRecognizer
                onSwipeDown={(state) => onSwipeDown(state)}
                config={config2}
                style={modalStyle.verticalScrollView}
            >
                <View style={topContainerStyle.container}>
                    <View style={topContainerStyle.indicatorBar}></View>
                    <ClassicButton
                        title="X"
                        style={topContainerStyle.button}
                        onPress={closeAction}
                    ></ClassicButton>
                </View>

                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ flex: 1 }}
                >
                    <View style={basicInfoStyle.container}>
                        <View style={basicInfoStyle.leftContainer}>
                            <Image
                                source={{
                                    uri: avatarURL,
                                }}
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 100 / 2,
                                }}
                            ></Image>
                        </View>
                        <View style={basicInfoStyle.rightContainer}>
                            <Text
                                style={[
                                    basicInfoStyle.text,
                                    { fontWeight: "bold", fontSize: 22 },
                                ]}
                            >
                                {name}
                            </Text>
                            <Text style={basicInfoStyle.text}>{birth}</Text>
                            <Text style={basicInfoStyle.text}>{email}</Text>
                            <Text style={basicInfoStyle.text}>{phone}</Text>
                        </View>
                    </View>

                    <View style={[moreInfoStyle.container, { height: 680 }]}>
                        <Punctuation
                            style={moreInfoStyle.punctuationContainer}
                        ></Punctuation>
                    </View>
                    <View style={mapStyle.container}>
                        <Text style={mapStyle.text}>
                            {"Tap on the marker to get more info"}
                        </Text>
                        <MapView
                            style={{
                                height: 300,
                                width: "95%",
                                borderRadius: 15,
                            }}
                            initialRegion={{
                                latitude: 41.3799878,
                                longitude: 2.1378068,
                                latitudeDelta: 0.04,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: 41.3799878,
                                    longitude: 2.1378068,
                                }}
                                title={"Fake Coord with Real Address"}
                                description={`${street} ${cityZipCode}`}
                            />
                        </MapView>
                    </View>
                    <View
                        style={[
                            moreInfoStyle.container,
                            { backgroundColor: "#E6E6E6", height: 250 },
                        ]}
                    >
                        <Text style={{ textAlign: "center" }}>
                            More content
                        </Text>
                    </View>
                </ScrollView>
            </GestureRecognizer>
        </View>
    );
}
