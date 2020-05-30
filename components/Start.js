import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import { Chat } from './Chat'
import { decode, encode } from 'base-64'



export default class Screen1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      color: '#090C08'
    }
  }

  render() {
    if (!global.btoa) { global.btoa = encode }

    if (!global.atob) { global.atob = decode }
    return (

      <ImageBackground source={require('../assets/Background-Image.png')} style={{ width: '100%', height: '100%' }} >
        <View style={styles.container}>
          <Text style={{ marginBottom: 250, color: 'white', fontSize: 30, fontWeight: 'bold' }}>Chat App</Text>
          <View style={styles.box}>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Your Name'
              />
            </View>
            <View>
              <Text style={{ textAlign: "center", fontSize: 15, color: '#8A95A5' }}>Choose Background Color{this.state.text}</Text>
              <View style={styles.color}>
                <Button
                  title=''
                  onPress={() => this.setState({ color: '#090C08' })}
                  buttonStyle={styles.color1}
                />
                <Button
                  title=''
                  onPress={() => this.setState({ color: '#474056' })}
                  buttonStyle={styles.color2}
                />
                <Button
                  title=''
                  onPress={() => this.setState({ color: '#8A95A5' })}
                  buttonStyle={styles.color3}
                />
                <Button
                  title=''
                  onPress={() => this.setState({ color: '#B9C6AE' })}
                  buttonStyle={styles.color4}
                />
              </View>
            </View>
            <View style={styles.button_start}>
              <Button
                buttonStyle={styles.button_start}
                color='black'
                title="Start Chatting"
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
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
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  input: {
    textAlign: 'center',
    fontSize: 20,
    width: 300,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1
  },
  color: {
    flexDirection: "row",
    margin: 20,
    marginTop: 10
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
    height: 60,
    backgroundColor: '#090C08'
  }

})