//import KeyboardSpacer from "react-native-keyboard-spacer";
import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

import firebase from "firebase";
import "firebase/firestore";

import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
//import MapView from 'react-native-maps';

/**
 * @class chat
 * @requires React
 * @requires React-native
 * @requires React-native-gifted-Chat
 * @requires firebase
 * @requires firestore
 * @requires react-native-community/netinfo
 * @requires CustomActions form './CustomActions'
 */

export default class Chat extends React.Component {
  constructor() {
    super();
    /**
     * firestone credentials
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectId
     * @param {string} storageBucket
     * @param {string} messagingSenderId
     * @param {string} appId
     * @param {string} measurementId
     */

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

  /**
   * sets default data for a user if none is provived 
   * @function setUser
   * @param {string} _id
   * @param {string} name
   * @param {string} avatar
   * called in commponentWillMount()
   */

  setUser = (_id, name = 'Guest User', avatar = 'https://placeimg.com/140/140/any') => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: avatar,
      }
    })
  }

  /**
   * updates the state based on firebase collection update
   * is called when the collection is updated
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {data} createdAt
   * @param {string} user
   * @param {string} image
   * @param {location} location
   */

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

  /**
   * Adds message to firebase database 
   * @function addMessage
   * @param {number} _id
   * @param {string} text
   * @param {data} createdAt
   * @param {string} user
   * @param {number} uid
   * @param {image} image
   * @param {location} location 
   */

  addMessage = () => {
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

  onSend = (messages = []) => {
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

  // async functions

  /**
   * load all messages from async storage
   * @function getMessages
   * @async
   * @return {Promise<string>} data from storage
   */

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

  /**
   * saves messages to AsyncStorage
   * @function saveMessages
   * @async
   * @return {Promise<string>} data will be saved to storage
   */

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * deletes messages from AsyncStorage
   * @function deleteMessage
   * @async
   * @return {Promise<string>} data will be delated from storage
   */

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

  // Gifted Chat finctions

  /**
   * GiftedChat renderBubble
   * @function renderBubble
   * sets background color of the bubbles
   */

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

  /**
   * Removes toolbar if the device is offline
   * @function  renderInputToolbar
   */

  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      )
    }
  }

  /**
   * Renders custom actions definded in customActions component 
   */

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  /**
   * Renders map view whwn someone shares location
   */

  /*
 renderCustomView(props) {
   const { currentMessage } = props;
   if (currentMessage.location) {
     return (
       <MapView
         style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
         region={{ latitude: currentMessage.location.latitude, longitude: currentMessage.location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
       />
     );
   }
   return null;
 }
 */

  render() {
    /**
     * Uses name and color param selected on start screen
     */
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
          renderCustomView={this.renderCustomView}
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