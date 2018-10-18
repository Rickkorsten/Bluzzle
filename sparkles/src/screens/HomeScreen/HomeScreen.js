import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import LottieView from 'lottie-react-native';
import axios from 'axios';

const width = '80%';
const height = '80%';

class HomeScreen extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    activeUser: this.props.activeUser,
    waiting: false
  }

  async componentDidMount() {
    const { _id, search_spark } = this.state.activeUser;
    if (!search_spark) {
      this.getRelationUserId(_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeUser !== this.props.activeUser) {

      this.setState({ activeUser: nextProps.activeUser });
      console.log('next search spark ' + nextProps.activeUser.search_spark);
      if (!nextProps.activeUser.search_spark) {
        this.getRelationUserId(nextProps.activeUser._id);
      } else {
        // there is no active relation
        this.props.setActiveRelation(null)
      }
    }
  }

  getRelationUserId = (_id) => {

    axios.get(`https://sparklesapi.azurewebsites.net/relation/active_relation/${_id}`)
      .then(async res => {
        // set active relation
        this.props.setActiveRelation(res.data[0])
        console.log(res.data[0]);
        const { first_user_id, second_user_id } = res.data[0];
        if (_id == first_user_id) {
          const relationUserData = await this.getRelationUserData(second_user_id);
          this.setState({ relationUserData })
        } else {
          const relationUserData = await this.getRelationUserData(first_user_id)
          this.setState({ relationUserData })
        }
      }).catch(err => {
        console.log(err.message);
      })
  }


  getRelationUserData = (id) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://sparklesapi.azurewebsites.net/user/${id}`)
        .then(res => {
          resolve(res.data)
        }).catch(err => {
          console.log(err.message);
        })
    })
  }

  createRelation = () => {
    const { _id, preference, language } = this.props.activeUser;
    console.log(_id, preference, language);
    axios.get(`https://sparklesapi.azurewebsites.net/matching/search_match/${_id}/${preference}/${language}`)
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err.message);
        this.setState({ waiting: true })
      })
  }

  renderSearchView = () => {
    const { search_spark } = this.props.activeUser;
    return (
      <View style={styles.sparkContainer}>
        <LottieView
          style={{
            width: 100
          }}
          source={require('./../../../assets/animation-searching.json')}
          autoPlay
          loop
        />
        <Text style={styles.underline}>
          Looking for the{"\n"}
          perfect Spark</Text>

        <View>
          {
            this.state.waiting || search_spark == 'waiting' ?
              <TouchableOpacity onPress={this.createRelation} on style={styles.searchBatch}>
                <Text style={styles.searchBatchText}>searching</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.createRelation} on style={styles.matchButton}>
                <Text style={styles.matchButtonText}>Start a new Spark</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
    )
  }

  renderActiveView = () => {
    const { firstName, userImage } = this.state.relationUserData;
    console.log(this.state.relationUserData);
    return (
      <ImageBackground
        source={{ uri: `https://sparklesapi.azurewebsites.net/${userImage}` }}
        imageStyle={{ resizeMode: 'cover', width: '100%', height: '100%' }}
        style={styles.sparkContainerActive}
        blurRadius={12}>
        <Text> </Text>
        <Text style={styles.sparkName}>{firstName}</Text>
      </ImageBackground>
    )
  }

  render() {
    const { _id, search_spark } = this.props.activeUser;
    let content;

    if (search_spark || search_spark == 'waiting') {
      content = this.renderSearchView()
    } else if (this.state.relationUserData) {
      content = this.renderActiveView()
    } else {
      content = <View><Text>Loading...</Text></View>
    }
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Sparkles</Text>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkContainer: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sparkContainerActive: {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logo: {
    marginBottom: 30,
    fontFamily: 'Raleway-Light',
    fontSize: 32,
    textAlign: 'center'
  },
  underline: {
    marginTop: 20,
    fontFamily: 'Raleway-Light',
    fontSize: 22,
    textAlign: 'center'
  },
  sparkName: {
    marginBottom: 30,
    marginLeft: 30,
    fontFamily: 'Raleway-Light',
    fontSize: 32,
    color: 'white'
  },
  matchButton: {
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 28,
    paddingRight: 28,
    borderRadius: 16,
    borderTopRightRadius: 4,
    backgroundColor: '#f19894',
    marginBottom: -60,
    marginTop: 100
  },
  matchButtonText: {
    color: '#fff',
    fontFamily: 'Raleway-Light',
    fontSize: 18,
    textAlign: 'center'
  },
  searchBatch: {
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 28,
    paddingRight: 28,
    borderRadius: 16,
    borderTopRightRadius: 4,
    backgroundColor: '#fff',
    marginBottom: -60,
    marginTop: 100
  },
  searchBatchText: {
    color: '#f19894',
    fontFamily: 'Raleway-Light',
    fontSize: 18,
    textAlign: 'center'
  },
  elevationLow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },

});

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    authToken: state.authToken,
    activeRelation: state.activeRelation
  }
};

export default connect(mapStateToProps, actions)(HomeScreen);