import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reqres.in/',
  timeout: 10 * 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    // Authorization: "Basic Q3VyaW9NYXN0ZXI6QGluKSpeaGVfKGFsJSRtZSk1MiF+Rw==", //Basic Auth changes CurioMaster
    // ip: "",
    // deviceToken: "",
    // timeZone: "",
    // deviceDetails: "",
    // // 'accesstoken': accessToken(),
    // lang: userLanguage(),
  },
});
class Network extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getCallFromAxios = () => {
    instance
      .get('https://reqres.in/api/users?page=2')
      .then(function (response) {
        console.log('API call for get axios', response, response.data);
      })
      .catch(error => {
        console.log('Error', error);
      });

    console.log('Call Complete');
  };

  postCallFromAxios = () => {
    instance
      .post('https://reqres.in/api/users?page=2', {
        name: 'morpheus',
        job: 'leader',
      })
      .then(function (response) {
        console.log('API call for post axios', response, response.data);
      })
      .catch(error => {
        console.log('Error', error);
      });
    console.log('Call Complete');
  };

  postDataFromServer = () => {
    fetch('https://reqres.in/api/users?page=2', {
      method: 'POST',
      body: {
        name: 'morpheus123',
        job: 'leader',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        res.json().then(json => {
          console.log(JSON.stringify(json), 'Response from POST API', json);
        });
      })
      .catch(err => {
        console.log(err, 'Error from POST API');
      });
  };

  getDataFromServer = () => {
    fetch('https://reqres.in/api/users?page=2', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user_id: ' ',
      },
    })
      .then(res => {
        console.log(res, 'testing res........');
        res.json().then(json => {
          console.log('Response from GET API', json);
        });
      })
      .catch(err => {
        console.log(err, 'Error from GET API');
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Text> Sample for FETCH API's </Text>
        <Button
          onPress={() => this.getDataFromServer()}
          title="Click to GET API Call"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

        <Button
          onPress={() => this.postDataFromServer()}
          title="Click to POST API Call"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

        <Button
          onPress={() => this.getCallFromAxios()}
          title="Click to GET API Call for Axios"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

        <Button
          onPress={() => this.postCallFromAxios()}
          title="Click to Post API Call for Axios"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

export default Network;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
