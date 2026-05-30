import React from "react";
import { StyleSheet, View, Text } from "react-native";

const ComponentName = ({
  tableWidth,
  tableHeight,
  speed,
  score,
  setScore,
  transportation,
}) => {
  const [snake, setSnake] = React.useState([
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ]);

  const [targetCell, setTargetCell] = React.useState([4, 3]);

  const [food, setFood] = React.useState([5, 5]);
  const [direction, setDirection] = React.useState("right");

  const randomFoodPosition = () => {
    const x = Math.floor(Math.random() * tableWidth);
    const y = Math.floor(Math.random() * tableHeight);
    return [x, y];
  };

  addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        setDirection("up");
        break;
      case "ArrowDown":
        setDirection("down");
        break;
      case "ArrowLeft":
        setDirection("left");
        break;
      case "ArrowRight":
        setDirection("right");
        break;
    }
  });

  const moveSnake = () => {
    if (direction === "up") {
      setSnake((prev) => {
        const newHead = [prev[0][0], prev[0][1] - 1];
        return [newHead, ...prev.slice(0, -1)];
      });
    } else if (direction === "down") {
      setSnake((prev) => {
        const newHead = [prev[0][0], prev[0][1] + 1];
        return [newHead, ...prev.slice(0, -1)];
      });
    } else if (direction === "left") {
      setSnake((prev) => {
        const newHead = [prev[0][0] - 1, prev[0][1]];
        return [newHead, ...prev.slice(0, -1)];
      });
    } else if (direction === "right") {
      setSnake((prev) => {
        const newHead = [prev[0][0] + 1, prev[0][1]];
        return [newHead, ...prev.slice(0, -1)];
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export default ComponentName;
