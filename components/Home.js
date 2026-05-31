import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const clampNumber = (value, fallback, min, max) => {
  const parsedValue = parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsedValue));
};

export default function Home({
  tableWidth,
  setTableWidth,
  tableHeight,
  setTableHeight,
  speed,
  setSpeed,
  transportation,
  setTransportation,
  score,
  maxScore,
  onStart,
}) {
  const { width, height } = useWindowDimensions();
  const tongueAnim = React.useRef(new Animated.Value(0)).current;
  const blinkAnim = React.useRef(new Animated.Value(1)).current;
  const headAnim = React.useRef(new Animated.Value(0)).current;

  const contentWidth = Math.min(width * 0.92, 430);
  const titleGap = Math.min(width * 0.25, height * 0.08, 54);
  const snakeScale = Math.min(width / 380, 1);
  const tongueWidth = tongueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [26, 52],
  });
  const headTilt = headAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-7deg", "-13deg"],
  });
  const players = [
    "Yiğit Alp",
    "Selin Feyza",
    "Birol",
    "Tuğba",
    "Hira Nur",
    "Banu",
    "İrem",
    "Yaşar",
    "Perihan",
    "Ömer",
    "Nilgün",
  ];
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
          useNativeDriver: false,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.delay(900),
      ]),
    );

    const headLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(headAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: false,
        }),
        Animated.timing(headAnim, {
          toValue: 0,
          duration: 650,
          useNativeDriver: false,
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

  const changeValue = (setter, value, amount, min, max) => {
    setter(Math.min(max, Math.max(min, value + amount)));
  };

  const renderNumberField = ({ label, value, setter, fallback, min, max }) => (
    <View style={[styles.fieldGroup, { width: contentWidth }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Pressable
          style={styles.stepButton}
          onPress={() => changeValue(setter, value, -1, min, max)}
        >
          <Text style={styles.stepButtonText}>-</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(text) => setter(clampNumber(text, fallback, min, max))}
        />
        <Pressable
          style={styles.stepButton}
          onPress={() => changeValue(setter, value, 1, min, max)}
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );

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
              style={[styles.snakeTongueWrap, { width: tongueWidth }]}
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
        {renderNumberField({
          label: "Table Width",
          value: tableWidth,
          setter: setTableWidth,
          fallback: 20,
          min: 6,
          max: 32,
        })}
        {renderNumberField({
          label: "Table Height",
          value: tableHeight,
          setter: setTableHeight,
          fallback: 50,
          min: 6,
          max: 32,
        })}
        {renderNumberField({
          label: "Speed",
          value: speed,
          setter: setSpeed,
          fallback: 10,
          min: 1,
          max: 15,
        })}

        <View style={[styles.fieldGroup, { width: contentWidth }]}>
          <Pressable
            style={styles.toggleRow}
            onPress={() => setTransportation(!transportation)}
          >
            <Text style={styles.toggleText}>Transportation</Text>
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
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </Pressable>

      <View style={styles.scorePanel}>
        {score > 0 ? (
          <Text style={styles.scoreLine}>
            <Text style={styles.scoreLabel}>Score: </Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </Text>
        ) : null}
        <Text style={styles.scoreLine}>
          <Text style={styles.scoreLabel}>Max Score: </Text>
          <Text style={styles.scoreValue}>{maxScore}</Text>
        </Text>{" "}
        <Text style={styles.scoreLabel}>
          Player: {players[maxScore % players.length]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf7df",
    overflow: "hidden",
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
  },
  stepButtonText: {
    color: "#f9fff3",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 29,
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
  toggleText: {
    color: "#173115",
    fontSize: 16,
    fontWeight: "900",
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
  },
  startButtonText: {
    color: "#fff8f0",
    fontSize: 18,
    fontWeight: "900",
  },
  scorePanel: {
    marginTop: 28,
    alignItems: "center",
    gap: 6,
  },
  scoreLine: {
    color: "#173115",
    textAlign: "center",
  },
  scoreLabel: {
    color: "#2f7a25",
    fontSize: 24,
    fontWeight: "900",
  },
  scoreValue: {
    color: "#d92132",
    fontSize: 20,
    fontWeight: "900",
  },
});
