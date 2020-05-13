import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';



export default class Screen1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',

    }
  }

  render() {
    return (
      <ImageBackground source={require('../assets/Background-Image.png')} style={{ width: '100%', height: '100%' }} >
        <View style={styles.container}>
          <Text>Chat App</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
              placeholder='Your Name'
            />
            <Text>Choose Background Color</Text>
            <View style={styles.color}>
              <Button
                title=''
                onPress={() => this.props.navigation.navigate('Screen2')}
                buttonStyle={styles.color1}
              />
              <Button
                title=''
                onPress={() => this.props.navigation.navigate('Screen2')}
                buttonStyle={styles.color2}
              />
              <Button
                title=''
                onPress={() => this.props.navigation.navigate('Screen2')}
                buttonStyle={styles.color3}
              />
              <Button
                title=''
                onPress={() => this.props.navigation.navigate('Screen2')}
                buttonStyle={styles.color4}
              />
            </View>
            <View style={styles.button_start}>
              <Button
                buttonStyle={styles.button_start}
                color='black'
                title="Start Chatting"
                onPress={() => this.props.navigation.navigate('Screen2')}
              />
            </View>
          </View>
        </View>
      </ImageBackground >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  box: {
    backgroundColor: 'white',
    height: 300,
    width: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  input: {
    textAlign: 'center',
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  color: {
    flexDirection: "row",
    margin: 20,
  },
  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginLeft: 10,
    marginRight: 10,
  },
  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginLeft: 10,
    marginRight: 10,
  },
  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginLeft: 10,
    marginRight: 10,
  },
  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginLeft: 10,
    marginRight: 10,
  },
  button_start: {
    width: 300,
    height: 40,
    backgroundColor: '#090C08'
  }

})