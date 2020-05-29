import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class CustomActions extends React.Component {

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        });
      } catch (err) {
        console.log(err);
      }

      if (!result.cancelled) {
        try {
          const imageUrlLink = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrlLink });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)

    if (status === 'granted') {
      try {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        });
      } catch (err) {
        console.log(err);
      }

      if (!result.cancelled) {
        try {
          const imageUrlLink = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrlLink });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }


  onActionPress = () => {
    const options = ['Choose From Library', 'Take picture', 'Send your location to a weirdo', 'Cancel']
    const cancelButtonIndex = options.length - 1;

    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.pickImage()
            return;
          case 1:
            this.takePhoto()
            return;
          case 2:
            this.getLocationtoSendtoWeirdos()
            return;
        }
      },
    );
  };



  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};