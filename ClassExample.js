import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';
class ClassExample extends Component {
  constructor(props) {
    super();
    console.log(props, 'lllll');
  }
  render() {
    return (
      <View>
        <Text>hi</Text>
        <Button
          title="Push Settings Screen"
          color="#710ce3"
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'App',
                options: {
                  topBar: {
                    title: {
                      text: 'App',
                    },
                  },
                },
              },
            });
          }}
        />
      </View>
    );
  }
}

export default ClassExample;
