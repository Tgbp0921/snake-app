import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from "react-native";

const ComponentName = ({
  setRunning,
  tableWidth,
  setTableWidth,
  tableHeight,
  setTableHeight,
  speed,
  setSpeed,
  transportation,
  setTransportation,
}) => {
  const { width, height } = useWindowDimensions();
  const tongueAnim = React.useRef(new Animated.Value(0)).current;
  const blinkAnim = React.useRef(new Animated.Value(1)).current;
  const headAnim = React.useRef(new Animated.Value(0)).current;

  const titleGap = Math.min(width * 0.25, height * 0.08, 56);
  const contentWidth = Math.min(width * 0.95, width - 24);
  const snakeScale = Math.min(width / 380, 1);
  const updateValue = (setter, value, amount, min = 1) => {
    setter(Math.max(min, value + amount));
  };
  const tongueWidth = tongueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [26, 48],
  });
  const headTilt = headAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-7deg", "-13deg"],
  });

  React.useEffect(() => {
    const tongueLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tongueAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: false,
        }),
        Animated.timing(tongueAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: false,
        }),
        Animated.delay(480),
      ]),
    );

    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1100),
        Animated.timing(blinkAnim, {
          toValue: 0.12,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ]),
    );

    const headLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(headAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(headAnim, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    tongueLoop.start();
    blinkLoop.start();
    headLoop.start();

    return () => {
      tongueLoop.stop();
      blinkLoop.stop();
      headLoop.stop();
    };
  }, [blinkAnim, headAnim, tongueAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.snakeScene} pointerEvents="none">
        <Animated.View
          style={[styles.snakeStage, { transform: [{ scale: snakeScale }] }]}
        >
          <View style={[styles.snakeSegment, styles.snakeTail]} />
          <View style={[styles.snakeSegment, styles.snakeBodyOne]} />
          <View style={[styles.snakeSegment, styles.snakeBodyTwo]} />
          <Animated.View
            style={[styles.snakeHead, { transform: [{ rotate: headTilt }] }]}
          >
            <View style={[styles.snakeEye, styles.leftEye]} />
            <Animated.View
              style={[
                styles.snakeEye,
                styles.rightEye,
                { transform: [{ scaleY: blinkAnim }] },
              ]}
            />
            <Animated.View
            style={[
              styles.snakeTongueWrap,
              {
                width: tongueWidth,
              },
            ]}
            >
              <View style={styles.snakeTongueBase} />
              <View
                style={[styles.snakeTongueFork, styles.snakeTongueForkTop]}
              />
              <View
                style={[styles.snakeTongueFork, styles.snakeTongueForkBottom]}
              />
            </Animated.View>
          </Animated.View>
          <View style={styles.apple}>
            <View style={styles.appleLeaf} />
          </View>
        </Animated.View>
      </View>

      <Text style={[styles.title, { width: contentWidth }]}>
        Welcome to the Snake Game!
      </Text>

      <View style={[styles.form, { marginTop: titleGap }]}>
        <View style={[styles.fieldGroup, { width: contentWidth }]}>
          <Text style={styles.label}>Table Width</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setTableWidth, tableWidth, -1)}
            >
              <Text style={styles.stepButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(tableWidth)}
              onChangeText={(text) => setTableWidth(parseInt(text) || 20)}
            />
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setTableWidth, tableWidth, 1)}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.fieldGroup, { width: contentWidth }]}>
          <Text style={styles.label}>Table Height</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setTableHeight, tableHeight, -1)}
            >
              <Text style={styles.stepButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(tableHeight)}
              onChangeText={(text) => setTableHeight(parseInt(text) || 50)}
            />
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setTableHeight, tableHeight, 1)}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.fieldGroup, { width: contentWidth }]}>
          <Text style={styles.label}>Speed</Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setSpeed, speed, -1)}
            >
              <Text style={styles.stepButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(speed)}
              onChangeText={(text) => setSpeed(parseInt(text) || 10)}
            />
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => updateValue(setSpeed, speed, 1)}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.fieldGroup, { width: contentWidth }]}>
          <Text style={styles.label}>Transportation</Text>
          <TouchableOpacity
            style={styles.toggleRow}
            activeOpacity={0.82}
            onPress={() => setTransportation(!transportation)}
          >
            <View
              style={[
                styles.toggleTrack,
                transportation && styles.toggleTrackActive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  transportation && styles.toggleThumbActive,
                ]}
              />
            </View>
            <Text style={styles.toggleText}>
              {transportation ? "True" : "False"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.82}
        onPress={() => setRunning(true)}
      >
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf7df",
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingVertical: 14,
  },
  snakeScene: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  snakeStage: {
    position: "absolute",
    top: 0,
    width: 360,
    height: 170,
  },
  snakeSegment: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#5fb936",
    borderWidth: 4,
    borderColor: "#377d25",
  },
  snakeTail: {
    left: 12,
    top: 112,
    transform: [{ rotate: "-22deg" }],
  },
  snakeBodyOne: {
    left: 62,
    top: 86,
  },
  snakeBodyTwo: {
    left: 120,
    top: 100,
  },
  snakeHead: {
    position: "absolute",
    left: 172,
    top: 82,
    width: 90,
    height: 72,
    borderRadius: 38,
    backgroundColor: "#78cf45",
    borderWidth: 4,
    borderColor: "#2f7a25",
  },
  snakeEye: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "#162015",
    borderWidth: 3,
    borderColor: "#fff",
  },
  leftEye: {
    right: 23,
    top: 15,
  },
  rightEye: {
    right: 10,
    top: 36,
  },
  snakeTongueWrap: {
    position: "absolute",
    left: 80,
    top: 39,
    height: 18,
  },
  snakeTongueBase: {
    position: "absolute",
    left: 0,
    top: 7,
    width: "100%",
    height: 4,
    borderRadius: 4,
    backgroundColor: "#df3647",
  },
  snakeTongueFork: {
    position: "absolute",
    right: -1,
    width: 17,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#df3647",
  },
  snakeTongueForkTop: {
    top: 4,
    transform: [{ rotate: "-28deg" }],
  },
  snakeTongueForkBottom: {
    top: 10,
    transform: [{ rotate: "28deg" }],
  },
  apple: {
    position: "absolute",
    left: 294,
    top: 94,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d92132",
    borderWidth: 3,
    borderColor: "#9f1320",
    shadowColor: "#7b0f18",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  appleLeaf: {
    position: "absolute",
    right: 6,
    top: -16,
    width: 26,
    height: 16,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: "#2f8d3c",
    transform: [{ rotate: "-28deg" }],
  },
  title: {
    color: "#173115",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(21, 54, 14, 0.3)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 8,
  },
  form: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
    alignSelf: "center",
  },
  label: {
    color: "#1f351d",
    fontSize: 15,
    fontWeight: "800",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 88,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6aa74d",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#173115",
    fontSize: 18,
    fontWeight: "800",
    paddingHorizontal: 16,
    textAlign: "center",
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#173115",
    shadowColor: "#1f351d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleRow: {
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6aa74d",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  toggleTrack: {
    width: 58,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#9fb394",
    padding: 3,
    justifyContent: "center",
  },
  toggleTrackActive: {
    backgroundColor: "#5fb936",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  toggleText: {
    color: "#173115",
    fontSize: 16,
    fontWeight: "900",
  },
  stepButtonText: {
    color: "#f9fff3",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 29,
  },
  startButton: {
    marginTop: 18,
    minWidth: 210,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d92132",
    borderWidth: 3,
    borderColor: "#9f1320",
    shadowColor: "#7b0f18",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: "#fff8f0",
    fontSize: 18,
    fontWeight: "900",
  },
});

export default ComponentName;
