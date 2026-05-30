import React from "react";
import { StyleSheet, View, Text, useWindowDimensions, Pressable } from "react-native";

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
  const [food, setFood] = React.useState([5, 5]);
  const [direction, setDirection] = React.useState("right");
  const directionRef = React.useRef(direction);
  const foodRef = React.useRef(food);
  const touchStartRef = React.useRef(null);
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
  const boardBorderWidth = 3;

  const isSnakeCell = (x, y) =>
    snake.some((segment) => segment[0] === x && segment[1] === y);

  const isSnakeHead = (x, y) =>
    snake[snake.length - 1]?.[0] === x && snake[snake.length - 1]?.[1] === y;

  const isFoodCell = (x, y) => food[0] === x && food[1] === y;

  React.useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  React.useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const isSameCell = (firstCell, secondCell) =>
    firstCell[0] === secondCell[0] && firstCell[1] === secondCell[1];

  const changeDirection = (nextDirection) => {
    const currentDirection = directionRef.current;

    if (nextDirection === "up" && currentDirection !== "down") {
      setDirection("up");
    } else if (nextDirection === "down" && currentDirection !== "up") {
      setDirection("down");
    } else if (nextDirection === "left" && currentDirection !== "right") {
      setDirection("left");
    } else if (nextDirection === "right" && currentDirection !== "left") {
      setDirection("right");
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.nativeEvent;
    touchStartRef.current = {
      x: touch.pageX,
      y: touch.pageY,
    };
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current) {
      return;
    }

    const touch = event.nativeEvent;
    const dx = touch.pageX - touchStartRef.current.x;
    const dy = touch.pageY - touchStartRef.current.y;
    const minSwipeDistance = 24;

    touchStartRef.current = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < minSwipeDistance) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? "right" : "left");
    } else {
      changeDirection(dy > 0 ? "down" : "up");
    }
  };

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
      if (e.key === "ArrowUp") {
        changeDirection("up");
      } else if (e.key === "ArrowDown") {
        changeDirection("down");
      } else if (e.key === "ArrowLeft") {
        changeDirection("left");
      } else if (e.key === "ArrowRight") {
        changeDirection("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const initialFood = createRandomFood(snake);
    setFood(initialFood);
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
          setFood(newFood);
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
            width: boardPixelWidth + boardBorderWidth * 2,
            height: boardPixelHeight + boardBorderWidth * 2,
            borderWidth: boardBorderWidth,
          },
        ]}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
      <View style={styles.homeButtonWrap}>
        <Pressable style={styles.homeButton} onPress={() => setRunning(false)}>
          <View style={styles.homeRoof} />
          <View style={styles.homeBody}>
            <View style={styles.homeDoor} />
          </View>
        </Pressable>
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
    borderColor: "#173115",
    backgroundColor: "#d9efca",
    overflow: "visible",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    boxSizing: "border-box",
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
  homeButtonWrap: {
    marginTop: 18,
    alignItems: "center",
  },
  homeButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#173115",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1f351d",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
    elevation: 6,
  },
  homeRoof: {
    width: 28,
    height: 28,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#f9fff3",
    transform: [{ rotate: "45deg" }],
    marginBottom: -17,
  },
  homeBody: {
    width: 28,
    height: 22,
    borderWidth: 4,
    borderTopWidth: 0,
    borderColor: "#f9fff3",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  homeDoor: {
    width: 7,
    height: 11,
    backgroundColor: "#f9fff3",
  },
});

export default ComponentName;
