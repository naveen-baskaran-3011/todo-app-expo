import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState();

  const [taskItems, setTaskItems] = useState([]);

  const handleTask = () => {
    Keyboard.dismiss();
    let changesArray = [...taskItems, task];
    setTaskItems(changesArray);
    storeListItemsToStorage(JSON.stringify(changesArray));
    setTask(null);
  };

  const completeTask = (index) => {
    let abc = [...taskItems];
    abc.splice(index, 1);
    storeListItemsToStorage(JSON.stringify(abc));
    setTaskItems(abc);
  };

  const getListItemsFromStorage = async() => {
    try {
      let storedList = await AsyncStorage.getItem('itemsArray');
      if(storedList !== null) {
        setTaskItems(JSON.parse(storedList));
      }
      return storedList;
    } catch(e) {
      console.log('Error while retriving data', e);
    }
  
    console.log('Done.')
  }

  const storeListItemsToStorage = async (itemsArray) => {
    try {
      await AsyncStorage.setItem('itemsArray', itemsArray);
    } catch(e) {
      console.log('Error while setting data', e);
    }
  
    console.log('Done.')
  }

  getListItemsFromStorage();


  return (
    <View style={styles.container}>
      {/* Today's tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>

        <ScrollView horizontal={false} style={styles.items}>
          {/* list of tasks */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                  <Task text={item}/>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </View>

      {/* Write a task section */}
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.writeTaskWrapper}>
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)}/>
        <TouchableOpacity style={styles.addWrapper} onPress={() => handleTask()}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    marginTop: 80,
    marginHorizontal: 20,
    maxHeight: '75%'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 50,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addText: {}
});
