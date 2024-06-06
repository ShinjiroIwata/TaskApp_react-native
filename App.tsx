import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import TaskList from "./src/components/TaskList";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TaskList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
