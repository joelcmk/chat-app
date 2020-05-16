import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from "react-native-keyboard-spacer";





export default class Chat extends React.Component {

  state = {
    messages: [],
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.navigation.state.params.name + ' entered the chat.',
          createdAt: new Date(),
          system: true,
        }
      ],
    })
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.color }}>
        <Text style={{ textAlign: "center", color: 'white', fontSize: 30, fontWeight: 'bold' }}>{this.props.navigation.state.params.name}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/*Platform.OS === 'android' ? <KeyboardSpacer /> : null*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
