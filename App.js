import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, WebView, Keyboard, Image, FlatList, AlertIOS } from 'react-native';
import { List, ListItem, Button } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import { Font } from 'expo';
const mapHTML = require('./mapApi.html');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Amazon Flex',
    headerStyle: { backgroundColor: '#146eb4' },
    headerTitleStyle: {
        fontSize: 40,
        color: '#ff9900',
        fontFamily: 'American Typewriter'
        }
  };
  constructor(props) {
    super(props);
    this.state = {
      startLocation: 'Choose starting point...',
      endLocation: 'Choose destination point...',
      message: 'initial',
      fontLoaded: false,
      routeLoaded: false,
      noRouting: false,
      startLocker: 'here',
      endLocker: 'there'
   };
   this.onMessage = this.onMessage.bind(this);
   this.handleKeyDown = this.handleKeyDown.bind(this);
   this.correspondPoint = this.correspondPoint.bind(this);
   this.sendFixedDataToWebView = this.sendFixedDataToWebView.bind(this);
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  correspondPoint(event) {
    if(event == 'RI Station') {
      let locationInfo = {
        start: this.state.startLocation,
        end: this.state.endLocation,
        route: 1
      }
      this.webView.postMessage(JSON.stringify(locationInfo));
    } else {
      let locationInfo = {
        start: this.state.startLocation,
        end: this.state.endLocation,
        route: 2
      }
      this.webView.postMessage(JSON.stringify(locationInfo));
    }
  }

  handleKeyDown(event) {
    this.sendDataToWebView();
  }

  onMessage(event) {
    if(event.nativeEvent.data == "Nothing") {
      this.setState({noRouting: true});
    }
    else {
      this.setState({noRouting: false});
      this.setState({routeLoaded: true});
      let messageObject = JSON.parse(event.nativeEvent.data);
      this.setState({message: messageObject.name});
      this.setState({startLocker: messageObject.startLocation});
      this.setState({endLocker: messageObject.endLocation});
    }
  }

  sendDataToWebView() {
    Keyboard.dismiss();
    let locationInfo = {
      start: this.state.startLocation,
      end: this.state.endLocation
    }
    this.webView.postMessage(JSON.stringify(locationInfo));
  }

  sendFixedDataToWebView() {
    this.setState({ startLocation: 'Cornell Tech'});
    this.setState({ endLocation: 'New York City Hall'});
    let locationInfo = {
      start: this.state.startLocation,
      end: this.state.endLocation,
      route: 0
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
    AlertIOS.alert(
     'Congratulations',
     'We have new delivery oppurtunites for you!',
     [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
       {text: 'View', onPress: () => this.sendFixedDataToWebView()},
     ],
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.Container}>
        <View style={styles.TitleDiv}>
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
        { this.state.noRouting ? (
          <Text style={{padding: 10, color: '#ff9900', fontSize: 20}}>We do not have a recommentation for you, please check back later!</Text>) : null
        }
        { this.state.routeLoaded ? (
          <View style={{position:'absolute', zIndex:999, width: 160, top:65}}>
            <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
              <FlatList
                data={[{end: 'RI Station', start:'Cornell Tech', value: '$5'},
                {end: '42nd St', start:'RI Station', value: '$10'},
                {end: '34th St', start:'63th St', value: '$7'},
                {end: '14th St', start:'57th St', value: '$15'}]}
                renderItem={({ item }) => (
                <ListItem
                  title={`${item.end}`}
                  subtitle={item.start}
                  rightTitle={item.value}
                  titleContainerStyle={{width:120}}
                  subtitleContainerStyle={{width:120}}
                  rightTitleStyle={{ color: 'black'}}
                  subtitleStyle={{ fontSize: 10}}
                  hideChevron={true}
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={() => this.correspondPoint(item.end)}
                />
              )}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </List>
            <Button
              raised
              containerViewStyle={{width:'100%', marginLeft: 0}}
              iconRight={{name: 'accessibility'}}
              backgroundColor='#4885ed'
              color='white'
              title='Go'
              onPress={() => navigate('Chat', { start: this.state.startLocation, end: this.state.endLocation })} />
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

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Detail Map',
  };

  constructor(props) {
    super(props);
    this.state = {
      startLocation: '',
      endLocation: '',
      routeLoaded: false,
      showInstruction: false
   };
   this.toggleInstruction = this.toggleInstruction.bind(this)
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: "#CED0CE",
          marginLeft: "10%"
        }}
      />
    );
  };

  toggleInstruction() {
    this.setState({showInstruction: !this.state.showInstruction})
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ startLocation: params.start });
    this.setState({ endLocation: params.end });
    let locationInfo = {
      start: params.start,
      end: params.end,
      route: 1
    }
    setTimeout(() => {
      this.refs.newWebView.postMessage(JSON.stringify(locationInfo));
    }, 300);
    this.setState({routeLoaded: true});
  }

  render() {
    return (
      <View style={styles.Container}>
        <WebView
          ref='newWebView'
          source={ mapHTML }
          style={{flex:1}}
          />
          { this.state.showInstruction ? (
          <View style={{position:'absolute', zIndex:999, bottom:45, width:'100%'}}>
            <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
              <FlatList
                data={[{key: 'Your location', value: 'Walk 0.3 mi (5 mins)', icon: 'accessibility'},
                  {key: 'Roosevelt Island', value: 'Pick up package from Amazon Locker next to F', icon:'work'},
                  {key:'Roosevelt Island F train', value: 'Coney Island - Stillwell Av', icon: 'train'},
                  {key:'34 Street - Herald Sq Station', value: 'Transit to R train', icon: 'train'},
                  {key:'City Hall (New York City Hall)', value: 'Drop off package at Amazon Locker next exit', icon: 'work'},
                  {key:'Destination', value: 'Walk 0.1 mi (2 mins)', icon: 'accessibility'}]}
                renderItem={({ item }) => (
                <ListItem
                  leftIcon={{name:item.icon}}
                  title={item.key}
                  subtitle={item.value}
                  subtitleStyle={{ fontSize: 10}}
                  titleStyle={{ fontSize: 14}}
                  containerStyle={{ borderBottomWidth: 0 }}
                />
              )}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </List>
          </View>) : null}
          <Button
            raised
            containerViewStyle={{width:'100%', marginLeft: 0}}
            iconRight={{name: 'directions'}}
            backgroundColor='#4885ed'
            color='white'
            title='Get Instruction'
            onPress={this.toggleInstruction} />
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen }
});

export default class App extends React.Component {
  render() {
    return <SimpleApp  />;
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  PositionDiv: {
    position:'absolute',
    zIndex:999,
    backgroundColor: 'white'
  },
  TitleDiv: {
    backgroundColor:'#146eb4',
    paddingTop: 10,
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
