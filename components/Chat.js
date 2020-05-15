import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';




export default class Chat extends React.Component {


  render() {
    return (
      <View style={[
        styles.container,
        {
          backgroundColor: this.props.navigation.state.params.color,
        },
      ]}>
        <Text style={{ textAlign: "center", color: 'white', fontSize: 30, fontWeight: 'bold' }}>{this.props.navigation.state.params.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});