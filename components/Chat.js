import KeyboardSpacer from "react-native-keyboard-spacer";
import React, { Component } from "react";
import { StyleSheet, View, Platform, AsyncStorage } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

import firebase from "firebase";
import "firebase/firestore";

import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

export default class Chat extends React.Component {
  constructor() {
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCp6-JgfZ4TCVYjb8t_0dQ0Ddx8xE5eDxY",
        authDomain: "chat-554bf.firebaseapp.com",
        databaseURL: "https://chat-554bf.firebaseio.com",
        projectId: "chat-554bf",
        storageBucket: "chat-554bf.appspot.com",
        messagingSenderId: "954252734877",
        appId: "1:954252734877:web:b490739311d507d318ff74",
        measurementId: "G-F6MJ2T3K2B"
      })
    }

    //refernce collection
    this.referenceMessages = firebase.firestore().collection('messages');
    //get and store messages for chat
    this.state = {
      messages: [],
      isConnected: false,
    }
  }

  //this will put the users name in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  setUser = (_id, name = 'Guest User', avatar = 'https://placeimg.com/140/140/any') => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: avatar,
      }
    })
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: new Date(),
        user: data.user,
        image: data.image || '',
        location: data.location || null,
      });
    });
    this.setState({
      messages
    });
  };

  addMessage() {
    console.log(this.state.user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.user,
      uid: this.state.uid,
      image: this.state.messages[0].image || '',
      location: this.state.messages[0].location || null,
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  deleteMessage = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // listen to authentication events
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        console.log('online');
        this.setState({
          isConnected: true,
        })
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
          if (!this.props.navigation.state.params.name) {
            this.setUser(user.uid);
            this.setState({
              uid: user.uid,
              loggedInText: "Hello there"
            });
          } else {
            this.setUser(user.uid, this.props.navigation.state.params.name)
            this.setState({
              uid: user.uid,
              loggedInText: "Hello there"
            });
          }

          // create a reference to the active user's documents (messages)
          this.referenceMessageUser = firebase.firestore().collection("messages");
          // listen for collection changes for current user
          this.unsubscribeMessageUser = this.referenceMessageUser.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    })
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeMessageUser();
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#123458'
          },
          left: {
            backgroundColor: '#6495ED'
          }
        }}
      />
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      )
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //Renders map view whwn someone shares location
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, heigth: 100, borderRadius: 13, margin: 3 }}
          region={{ latitude: currentMessage.location.latitude, longitude: currentMessage.location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
        />
      );
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.navigation.state.params.color
        }}
      >
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }
});