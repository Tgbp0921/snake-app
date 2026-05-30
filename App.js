import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Home from "./components/Home";
import Table from "./components/Table";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [asyncData, setAsyncData] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const [tableWidth, setTableWidth] = React.useState(20);
  const [tableHeight, setTableHeight] = React.useState(50);
  const [transportation, setTransportation] = React.useState(false);
  const [speed, setSpeed] = React.useState(10);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    const loadScoreInfo = async () => {
      const defaultScoreInfo = { maxScore: 10 };

      try {
        const storedScoreInfo = await AsyncStorage.getItem("scoreInfo");

        if (storedScoreInfo) {
          setAsyncData(JSON.parse(storedScoreInfo));
          return;
        }

        await AsyncStorage.setItem(
          "scoreInfo",
          JSON.stringify(defaultScoreInfo),
        );
        setAsyncData(defaultScoreInfo);
      } catch (error) {
        console.log("AsyncStorage error:", error);
      }
    };

    loadScoreInfo();
  }, []);

  useEffect(() => {
    if (score > asyncData?.maxScore) {
      const newScoreInfo = { maxScore: score };
      setAsyncData(newScoreInfo);
      AsyncStorage.setItem("scoreInfo", JSON.stringify(newScoreInfo)).catch(
        (error) => console.log("AsyncStorage error:", error),
      );
    }
  }, [running]);

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
          transportation={transportation}
          setTransportation={setTransportation}
          setRunning={setRunning}
          tableWidth={tableWidth}
          setTableWidth={setTableWidth}
          tableHeight={tableHeight}
          setTableHeight={setTableHeight}
          speed={speed}
          setSpeed={setSpeed}
          running={running}
          asyncData={asyncData}
          score={score}
          maxScore={asyncData?.maxScore}
          setScore={setScore}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
