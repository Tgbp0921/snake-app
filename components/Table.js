import React from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const BOARD_BORDER_WIDTH = 3;
const MIN_SWIPE_DISTANCE = 24;

const Cell = React.memo(function Cell({ size, isSnake, isHead, isFood }) {
  return (
    <View
      style={[
        styles.cell,
        { width: size, height: size },
        isSnake && styles.snakeCell,
        isHead && styles.snakeHeadCell,
        isFood && styles.foodCell,
      ]}
    />
  );
});

const sameCell = (firstCell, secondCell) =>
  firstCell[0] === secondCell[0] && firstCell[1] === secondCell[1];

const cellKey = ([x, y]) => `${x}:${y}`;

const createInitialSnake = (boardWidth, boardHeight) => {
  const length = Math.min(4, boardWidth);
  const y = Math.min(3, boardHeight - 1);
  const startX = Math.max(0, Math.floor((boardWidth - length) / 2));

  return Array.from({ length }, (_, index) => [startX + index, y]);
};

const createFood = (boardWidth, boardHeight, snake) => {
  const snakeCells = new Set(snake.map(cellKey));
  const emptyCells = [];

  for (let y = 0; y < boardHeight; y += 1) {
    for (let x = 0; x < boardWidth; x += 1) {
      if (!snakeCells.has(`${x}:${y}`)) {
        emptyCells.push([x, y]);
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const getNextHead = (head, direction, boardWidth, boardHeight, wraps) => {
  const [x, y] = head;

  if (direction === "up") {
    return wraps ? [x, (y - 1 + boardHeight) % boardHeight] : [x, y - 1];
  }

  if (direction === "down") {
    return wraps ? [x, (y + 1) % boardHeight] : [x, y + 1];
  }

  if (direction === "left") {
    return wraps ? [(x - 1 + boardWidth) % boardWidth, y] : [x - 1, y];
  }

  return wraps ? [(x + 1) % boardWidth, y] : [x + 1, y];
};

const isVerticalDirection = (direction) =>
  direction === "up" || direction === "down";

export default function Table({
  tableWidth,
  tableHeight,
  speed,
  score,
  setScore,
  transportation,
  setRunning,
}) {
  const { width, height } = useWindowDimensions();
  const boardWidth = Math.min(32, Math.max(6, tableWidth));
  const boardHeight = Math.min(32, Math.max(6, tableHeight));
  const initialSnake = React.useMemo(
    () => createInitialSnake(boardWidth, boardHeight),
    [boardWidth, boardHeight],
  );
  const [snake, setSnake] = React.useState(initialSnake);
  const [food, setFood] = React.useState(() =>
    createFood(boardWidth, boardHeight, initialSnake),
  );
  const directionRef = React.useRef("right");
  const foodRef = React.useRef(food);

  const cellSize = Math.max(
    6,
    Math.floor(
      Math.min(
        (width - 32 - BOARD_BORDER_WIDTH * 2) / boardWidth,
        (height - 150 - BOARD_BORDER_WIDTH * 2) / boardHeight,
      ),
    ),
  );
  const boardPixelWidth = cellSize * boardWidth + BOARD_BORDER_WIDTH * 2;
  const boardPixelHeight = cellSize * boardHeight + BOARD_BORDER_WIDTH * 2;
  const snakeCellSet = React.useMemo(
    () => new Set(snake.map(cellKey)),
    [snake],
  );
  const head = snake[snake.length - 1];
  const tickDelay = Math.max(65, (420 - speed * 35) / 2);

  React.useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const changeDirection = React.useCallback((nextDirection) => {
    const currentDirection = directionRef.current;

    if (nextDirection === "up" && currentDirection !== "down") {
      directionRef.current = "up";
    } else if (nextDirection === "down" && currentDirection !== "up") {
      directionRef.current = "down";
    } else if (nextDirection === "left" && currentDirection !== "right") {
      directionRef.current = "left";
    } else if (nextDirection === "right" && currentDirection !== "left") {
      directionRef.current = "right";
    }
  }, []);

  const changeDirectionByQuadrant = React.useCallback(
    (x, y) => {
      const currentDirection = directionRef.current;
      const isLeftSide = x < width / 2;
      const isTopSide = y < height / 2;

      if (isVerticalDirection(currentDirection)) {
        changeDirection(isLeftSide ? "left" : "right");
      } else {
        changeDirection(isTopSide ? "up" : "down");
      }
    },
    [changeDirection, height, width],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.max(Math.abs(gestureState.dx), Math.abs(gestureState.dy)) >
          MIN_SWIPE_DISTANCE,
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;

          if (
            Math.max(Math.abs(dx), Math.abs(dy)) <= MIN_SWIPE_DISTANCE
          ) {
            changeDirectionByQuadrant(gestureState.x0, gestureState.y0);
            return;
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            changeDirection(dx > 0 ? "right" : "left");
          } else {
            changeDirection(dy > 0 ? "down" : "up");
          }
        },
      }),
    [changeDirection, changeDirectionByQuadrant],
  );

  React.useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined" ||
      typeof window.addEventListener !== "function"
    ) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        changeDirection("up");
      } else if (event.key === "ArrowDown") {
        changeDirection("down");
      } else if (event.key === "ArrowLeft") {
        changeDirection("left");
      } else if (event.key === "ArrowRight") {
        changeDirection("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnake((currentSnake) => {
        const currentHead = currentSnake[currentSnake.length - 1];
        const nextHead = getNextHead(
          currentHead,
          directionRef.current,
          boardWidth,
          boardHeight,
          transportation,
        );
        const currentFood = foodRef.current;
        const ateFood = currentFood && sameCell(nextHead, currentFood);
        const nextSnake = ateFood
          ? [...currentSnake, nextHead]
          : [...currentSnake.slice(1), nextHead];
        const hitWall =
          !transportation &&
          (nextHead[0] < 0 ||
            nextHead[0] >= boardWidth ||
            nextHead[1] < 0 ||
            nextHead[1] >= boardHeight);
        const hitSelf = nextSnake
          .slice(0, -1)
          .some((segment) => sameCell(segment, nextHead));

        if (hitWall || hitSelf) {
          setRunning(false);
          return currentSnake;
        }

        if (ateFood) {
          setScore((currentScore) => currentScore + speed);
          const nextFood = createFood(boardWidth, boardHeight, nextSnake);
          foodRef.current = nextFood;
          setFood(nextFood);
        }

        return nextSnake;
      });
    }, tickDelay);

    return () => clearInterval(interval);
  }, [
    boardHeight,
    boardWidth,
    setRunning,
    setScore,
    speed,
    tickDelay,
    transportation,
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>

      <View
        style={[
          styles.board,
          {
            width: boardPixelWidth,
            height: boardPixelHeight,
            borderWidth: BOARD_BORDER_WIDTH,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {Array.from({ length: boardHeight }).map((_, y) => (
          <View key={`row-${y}`} style={styles.row}>
            {Array.from({ length: boardWidth }).map((_, x) => {
              const key = `${x}:${y}`;

              return (
                <Cell
                  key={key}
                  size={cellSize}
                  isSnake={snakeCellSet.has(key)}
                  isHead={head && head[0] === x && head[1] === y}
                  isFood={food && food[0] === x && food[1] === y}
                />
              );
            })}
          </View>
        ))}
      </View>

      <Pressable style={styles.homeButton} onPress={() => setRunning(false)}>
        <View style={styles.homeRoof} />
        <View style={styles.homeBody}>
          <View style={styles.homeDoor} />
        </View>
      </Pressable>
    </View>
  );
}

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
  homeButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: 18,
    backgroundColor: "#173115",
    alignItems: "center",
    justifyContent: "center",
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
