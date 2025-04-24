import { useColorScheme } from 'react-native';

import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {

  const systemTheme = useColorScheme(); // 'light' | 'dark' | null

  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme || 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }
  interface Task {
    id: string;
    title: string;
    completed: boolean;
  }

  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load task : ', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save task : ', error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: task,
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask('');
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((t: any) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Button title={`Switch to ${theme === 'light' ? 'dark' : 'light'} Mode`} onPress={toggleTheme}></Button>
      <Text style={styles.heading}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder='Enter task' value={task} onChangeText={setTask}></TextInput>
        {/* <Button title='Add' onPress={addTask}></Button> */}
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={tasks} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => toggleTask(item.id)} onLongPress={() => deleteTask(item.id)} >
          <View style={styles.taskItem}>
            <Text style={[styles.taskText, item.completed && styles.completedText]}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}></FlatList>
    </View>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
    },

    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      margin: 20,
      textAlign: 'center',
      color: theme === 'dark' ? '#fff' : '#000'
    },

    inputContainer: {
      flexDirection: 'row',
      margin: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },

    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      marginRight: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff'
    },

    taskItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#ddd',
    },

    taskText: {
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000'
    },

    completedText: {
      textDecorationLine: 'line-through',
      color: theme === 'dark' ? '#aaa' : '#999'
    },

    addButton: {
      backgroundColor: theme === 'dark' ? '#4CAF50' : '#2196F3',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },

    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    }
  });