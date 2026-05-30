import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./components/Home";
import Table from "./components/Table";

const SCORE_INFO_KEY = "scoreInfo";
const DEFAULT_SCORE_INFO = { maxScore: 10, maxScoreUser: "birol" };

export default function App() {
  const [running, setRunning] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [scoreInfo, setScoreInfo] = React.useState(DEFAULT_SCORE_INFO);
  const [tableWidth, setTableWidth] = React.useState(20);
  const [tableHeight, setTableHeight] = React.useState(24);
  const [speed, setSpeed] = React.useState(10);
  const [transportation, setTransportation] = React.useState(false);

  React.useEffect(() => {
    const loadScoreInfo = async () => {
      try {
        const savedScoreInfo = await AsyncStorage.getItem(SCORE_INFO_KEY);

        if (savedScoreInfo) {
          setScoreInfo(JSON.parse(savedScoreInfo));
          return;
        }

        await AsyncStorage.setItem(
          SCORE_INFO_KEY,
          JSON.stringify(DEFAULT_SCORE_INFO),
        );
      } catch (error) {
        console.log("AsyncStorage load error:", error);
      }
    };

    loadScoreInfo();
  }, []);

  React.useEffect(() => {
    if (score <= scoreInfo.maxScore) {
      return;
    }

    const nextScoreInfo = { ...scoreInfo, maxScore: score };
    setScoreInfo(nextScoreInfo);

    AsyncStorage.setItem(SCORE_INFO_KEY, JSON.stringify(nextScoreInfo)).catch(
      (error) => console.log("AsyncStorage save error:", error),
    );
  }, [score, scoreInfo]);

  const startGame = () => {
    setScore(0);
    setRunning(true);
  };

  return (
    <View style={styles.container}>
      {running ? (
        <Table
          tableWidth={tableWidth}
          tableHeight={tableHeight}
          speed={speed}
          score={score}
          setScore={setScore}
          transportation={transportation}
          setRunning={setRunning}
        />
      ) : (
        <Home
          tableWidth={tableWidth}
          setTableWidth={setTableWidth}
          tableHeight={tableHeight}
          setTableHeight={setTableHeight}
          speed={speed}
          setSpeed={setSpeed}
          transportation={transportation}
          setTransportation={setTransportation}
          score={score}
          maxScore={scoreInfo.maxScore}
          onStart={startGame}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7df",
  },
});
