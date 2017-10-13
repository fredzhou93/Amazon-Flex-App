import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, WebView, Keyboard, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Font } from 'expo';
const mapHTML = require('./mapApi.html');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startLocation: 'Choose starting point...',
      endLocation: 'Choose destination point...',
      message: 'initial',
      fontLoaded: false,
      routeLoaded: false,
      startLocker: 'here',
      endLocker: 'there'
   };
   this.onMessage = this.onMessage.bind(this);
   this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    this.sendDataToWebView();
  }

  onMessage(event) {
    this.setState({routeLoaded: true});
    let messageObject = JSON.parse(event.nativeEvent.data);
    this.setState({message: messageObject.name});
    this.setState({startLocker: messageObject.startLocation});
    this.setState({endLocker: messageObject.endLocation});
  }

  sendDataToWebView() {
    Keyboard.dismiss();
    let locationInfo = {
      start: this.state.startLocation,
      end: this.state.endLocation
    }
    this.webView.postMessage(JSON.stringify(locationInfo));
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Modak': require('./assets/Modak-Regular.ttf'),
      'BreeSerif': require('./assets/BreeSerif-Regular.ttf'),
      'DaysOne': require('./assets/DaysOne-Regular.ttf'),
      'Play': require('./assets/Play-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.TitleDiv}>
        {
          this.state.fontLoaded ? (
          <Text style={styles.Title}>Amazon Flyx</Text>
          )
          : null
        }
        <TextInput
          selectTextOnFocus
          style={styles.InputBox}
          onChangeText={(startLocation) => this.setState({startLocation})}
          value={this.state.startLocation}
        />
        <TextInput
          selectTextOnFocus
          style={styles.InputBox}
          onChangeText={(endLocation) => this.setState({endLocation})}
          value={this.state.endLocation}
          onEndEditing={this.handleKeyDown}
        />
        </View>
        { this.state.routeLoaded ? (
          <View style={styles.packageSuggestion}>
            <Text style={styles.prompt}>We found a new oppurtunity for you!</Text>
            <View style={styles.packageFlex}>
              <Image
                style={{width: 40, height: 40}}
                source={require('./assets/package.jpg')}
              />
              <Text style={{marginLeft: 15, marginTop:7, fontSize:20, color: '#ff9900'}}>{this.state.message}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text>Please pick up the package at</Text>
              <Text style={{marginLeft:3, color:'#ff9900'}}>{this.state.startLocker}</Text>
              <Text style={{marginLeft:3}}>and drop off</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text>the package at</Text>
              <Text style={{marginLeft:3, color: '#ff9900'}}>{this.state.endLocker}.</Text>
            </View>
          </View>) : null
        }
        <WebView
          ref={( webView ) => this.webView = webView}
          source={ mapHTML }
          style={{flex:1}}
          onMessage={this.onMessage}
          />
      </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return <HomeScreen />;
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  TitleDiv: {
    backgroundColor:'#146eb4',
    paddingTop: 30,
    paddingBottom: 5
  },
  InputBox: {
    height: 30,
    backgroundColor: '#2d96e8',
    color: 'white',
    marginLeft: 30,
    paddingLeft: 10,
    marginBottom: 5,
    marginRight: 5
  },
  Title: {
    fontSize: 40,
    color: '#ff9900',
    marginLeft: 30,
    marginBottom: 5,
    fontFamily:'BreeSerif'
  },
  packageSuggestion: {
    backgroundColor: '#f2f2f2',
    padding: 10
  },
  packageFlex: {
    flexDirection: 'row'
  },
  prompt: {
    fontSize: 20,
    color: '#ff9900'
  }
});
