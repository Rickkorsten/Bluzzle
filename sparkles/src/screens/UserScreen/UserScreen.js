import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Picker } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../actions'

class UserScreen extends Component {

  state = {
    allUsers: undefined
  }

  componentWillMount() {
    this.getAllUsers()
  }

  getAllUsers = () => {
    axios.get('https://sparklesapi.azurewebsites.net/user')
      .then(result => {
        this.setState({
          allUsers: result.data.users,
          activeUserId: result.data.users[0]._id,
        }, () => this.props.setActiveUser(result.data.users[0]));
      })
  }

  setUser = (itemValue) => {
    this.setState({ activeUserId: itemValue }, () => {

      const result = this.state.allUsers.filter(obj => {
        return obj._id === this.state.activeUserId
      });

      this.props.setActiveUser(result[0]).then(
       // axios.post('https://sparklesapi.azurewebsites.net/user/login',
       console.log('then')
      )

    });
  }

  render() {
    if (!this.state.allUsers) {
      return <Text>loading...</Text>
    } else {
      return (
        <View style={styles.container}>
          <Text>Kies een gebruiker</Text>
          <Picker
            selectedValue={this.state.activeUserId}
            style={{ height: 150, width: "80%" }}
            onValueChange={(itemValue, itemIndex) => this.setUser(itemValue)}>
            {
              this.state.allUsers.map(user => {
                return (
                  <Picker.Item key={user._id} label={user.firstName + ' ' + user.lastName} value={user._id} />
                )
              })
            }
          </Picker>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return { activeUser: state.activeUser }
};

export default connect(mapStateToProps, actions)(UserScreen);