import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "../api/axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
      setError(null);
    } catch (error) {
      handleError(error);
    }
  };

  const addTask = async () => {
    if (newTaskTitle.trim() === "") {
      setError("Task title cannot be empty");
      return;
    }

    try {
      const response = await api.post("/tasks", { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setError(null);
    } catch (error) {
      handleError(error, "Failed to add task");
    }
  };

  const updateTask = async () => {
    if (editTaskTitle.trim() === "") {
      setError("Task title cannot be empty");
      return;
    }

    try {
      const response = await api.put(`/tasks/${editTaskId}`, {
        title: editTaskTitle,
      });
      setTasks(
        tasks.map((task) => (task.id === editTaskId ? response.data : task))
      );
      setEditTaskId(null);
      setEditTaskTitle("");
      setError(null);
    } catch (error) {
      handleError(error, "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (error) {
      handleError(error, "Failed to delete task");
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !completed });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
      setError(null);
    } catch (error) {
      handleError(error, "Failed to toggle task completion");
    }
  };

  const handleError = (error, defaultMessage = "An error occurred") => {
    console.error(error);
    if (error.response) {
      setError(error.response.data.message || defaultMessage);
    } else if (error.request) {
      setError("No response from server");
    } else {
      setError(error.message || defaultMessage);
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Task Title"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
      {editTaskId && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Edit Task Title"
            value={editTaskTitle}
            onChangeText={setEditTaskTitle}
          />
          <Button title="Update Task" onPress={updateTask} />
        </View>
      )}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id, item.completed)}
            >
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Button
                title="Edit"
                onPress={() => {
                  setEditTaskId(item.id);
                  setEditTaskTitle(item.title);
                }}
              />
              <Button title="Delete" onPress={() => deleteTask(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  formContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
    padding: 5,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "red",
    marginBottom: 10,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default TaskList;
