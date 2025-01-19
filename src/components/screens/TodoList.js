import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.10.29:5000/api/todos";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTodos(data.data || []);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) => [result.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } else {
      alert(result.message || "Error adding todo");
    }
  };

  const handleEditTodo = async () => {
    const response = await fetch(`${API_URL}/${editTodoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editTodoId ? { ...todo, title, description } : todo
        )
      );
      setTitle("");
      setDescription("");
      setShowForm(false);
      setEditTodoId(null);
    } else {
      alert(result.message || "Error editing todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      alert("Error deleting todo");
    }
  };

  const handleCancelEdit = () => {
    setTitle("");
    setDescription("");
    setShowForm(false);
    setEditTodoId(null);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://pbs.twimg.com/media/DTaBQskVQAEaDac.jpg:large", 
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>List Mata Kuliah</Text>

        {showForm ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Hari"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Mata Kuliah"
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={editTodoId ? handleEditTodo : handleAddTodo}
              >
                <Text style={styles.buttonText}>
                  {editTodoId ? "Perbarui" : "Tambah"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <FlatList
              data={todos}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.todoCard}>
                  <View>
                    <Text style={styles.todoTitle}>{item.title}</Text>
                    <Text style={styles.todoDescription}>{item.description}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditTodoId(item._id);
                        setTitle(item.title);
                        setDescription(item.description);
                        setShowForm(true);
                      }}
                    >
                      <Icon name="create" size={20} color="#2464EC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Icon name="add" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonPrimary: {
    backgroundColor: "#2464EC",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    margin: 5,
  },
  buttonSecondary: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  todoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  todoDescription: {
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2464EC",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
