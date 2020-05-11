import React, { Component } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';



export default class Screen1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = { text: '' }
  }

  render() {
    return (
      <View style={styles.cotainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          placeholder='Enter your name'
        />
        <Button
          title="Start Chatting"
          onPress={() => this.props.navigation.navigate('Screen2')}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'

  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
})