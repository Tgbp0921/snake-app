import React from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";

const ComponentName = ({
  tableWidth,
  tableHeight,
  speed,
  score,
  setScore,
  transportation,
  setRunning,
}) => {
  const { width, height } = useWindowDimensions();
  const [snake, setSnake] = React.useState([
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ]);
  const directionRef = React.useRef("right");
  const foodRef = React.useRef([5, 5]);
  const boardWidth = Math.max(1, tableWidth);
  const boardHeight = Math.max(1, tableHeight);
  const cellSize = Math.max(
    6,
    Math.floor(
      Math.min((width - 32) / boardWidth, (height - 120) / boardHeight),
    ),
  );
  const boardPixelWidth = cellSize * boardWidth;
  const boardPixelHeight = cellSize * boardHeight;

  const isSnakeCell = (x, y) =>
    snake.some((segment) => segment[0] === x && segment[1] === y);

  const isSnakeHead = (x, y) =>
    snake[snake.length - 1]?.[0] === x && snake[snake.length - 1]?.[1] === y;

  const isFoodCell = (x, y) =>
    foodRef.current[0] === x && foodRef.current[1] === y;

  const isSameCell = (firstCell, secondCell) =>
    firstCell[0] === secondCell[0] && firstCell[1] === secondCell[1];

  const getNextHead = (currentHead, currentDirection) => {
    const [x, y] = currentHead;

    if (currentDirection === "up") {
      return transportation
        ? [x, (y - 1 + boardHeight) % boardHeight]
        : [x, y - 1];
    }

    if (currentDirection === "down") {
      return transportation ? [x, (y + 1) % boardHeight] : [x, y + 1];
    }

    if (currentDirection === "left") {
      return transportation
        ? [(x - 1 + boardWidth) % boardWidth, y]
        : [x - 1, y];
    }

    return transportation ? [(x + 1) % boardWidth, y] : [x + 1, y];
  };

  const createRandomFood = (currentSnake = snake) => {
    const x = Math.floor(Math.random() * tableWidth);
    const y = Math.floor(Math.random() * tableHeight);

    if (currentSnake.some((segment) => isSameCell(segment, [x, y]))) {
      return createRandomFood(currentSnake);
    }

    return [x, y];
  };

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (e) => {
      const currentDirection = directionRef.current;

      if (e.key === "ArrowUp" && currentDirection !== "down") {
        directionRef.current = "up";
      } else if (e.key === "ArrowDown" && currentDirection !== "up") {
        directionRef.current = "down";
      } else if (e.key === "ArrowLeft" && currentDirection !== "right") {
        directionRef.current = "left";
      } else if (e.key === "ArrowRight" && currentDirection !== "left") {
        directionRef.current = "right";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const initialFood = createRandomFood(snake);
    foodRef.current = initialFood;
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[prevSnake.length - 1];
        const nextHead = getNextHead(currentHead, directionRef.current);
        const nextFood = foodRef.current;
        const ateFood = isSameCell(nextHead, nextFood);
        const nextSnake = ateFood
          ? [...prevSnake, nextHead]
          : [...prevSnake.slice(1), nextHead];
        const hitWall =
          !transportation &&
          (nextHead[0] < 0 ||
            nextHead[0] >= boardWidth ||
            nextHead[1] < 0 ||
            nextHead[1] >= boardHeight);
        const hitSelf = nextSnake
          .slice(0, -1)
          .some((segment) => isSameCell(segment, nextHead));

        if (hitWall || hitSelf) {
          setRunning(false);
          return prevSnake;
        }

        if (ateFood) {
          setScore((prevScore) => prevScore + speed);
          const newFood = createRandomFood(nextSnake);
          foodRef.current = newFood;
        }

        return nextSnake;
      });
    }, 500 / speed);

    return () => clearInterval(interval);
  }, [boardHeight, boardWidth, speed, transportation]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <View
        style={[
          styles.board,
          {
            width: boardPixelWidth,
            height: boardPixelHeight,
          },
        ]}
      >
        {Array.from({ length: boardHeight }).map((_, y) => (
          <View key={`row-${y}`} style={styles.row}>
            {Array.from({ length: boardWidth }).map((_, x) => (
              <View
                key={`${x}-${y}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                  },
                  isSnakeCell(x, y) && styles.snakeCell,
                  isSnakeHead(x, y) && styles.snakeHeadCell,
                  isFoodCell(x, y) && styles.foodCell,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf7df",
    padding: 16,
  },
  score: {
    color: "#173115",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  board: {
    borderWidth: 3,
    borderColor: "#173115",
    backgroundColor: "#d9efca",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 0.5,
    borderColor: "rgba(23, 49, 21, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  snakeCell: {
    backgroundColor: "#5fb936",
  },
  snakeHeadCell: {
    backgroundColor: "#173115",
  },
  foodCell: {
    backgroundColor: "#d92132",
  },
});

export default ComponentName;
