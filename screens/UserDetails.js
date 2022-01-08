import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';
//import CheckBox from 'react-native-check-box';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import SmsAndroid from 'react-native-get-sms-android';
import {colors} from '../Styles/Colors';
import {textStyles} from '../Styles/FontStyles';

const languages = ['English'];
const systemVersion = DeviceInfo.getSystemVersion();
const carrier = DeviceInfo.getCarrier().then(car => {
  // "SOFTBANK"
  return car;
});
class UserDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: '',
      firstName: '',
      lastName: '',
      isChecked: false,
      location: null,
      latitude: '',
      longitude: '',
      prefLanguage: '',
    };
  }

  componentDidMount = async () => {
    // this.getSMS();
  };

  updateUser = () => {
    const {firstName, lastName, prefLanguage, location} = this.state;
    const {
      customer: {details, socialDetails},
    } = this.props.route.params.userData;

    const params = {
      customerId: this.props.route.params.customerId.toString(),
      firstName: firstName,
      lastName: lastName,
      preferredLanguage: prefLanguage,
      mobileNumber: details.mobile_number,
      imeiNum: socialDetails.imei,
      simSerialNumber: socialDetails.imei,
    };

    if ((firstName !== '' || lastName !== '') && prefLanguage) {
      const url =
        'https://sit.l8r.in/profile-service/api/v1/customers/details/update';
      axios
        .put(url, params, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.route.params.tempAuthToken}`,
          },
        })
        .then(async res => {
          console.log('otp resp', res);
          if (res.data.statusCode == '201') {
            // this.setState({customerId:res.data.customer.details.customer_id})
            await AsyncStorage.setItem('isLoggedIn', 'true');
            // this.getSMS();
            this.props.navigation.navigate('Home');
            //   refRBSheet.current.open();
          } else {
            alert(res.statusText);
          }
        });
    }
  };

  getSMS = () => {
    const {
      customer: {details, socialDetails},
    } = this.props.route.params.userData;
    let filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      // the next 4 filters should NOT be used together, they are OR-ed so pick one
      // read: 0, // 0 for unread SMS, 1 for SMS already read
      // _id: 1234, // specify the msg id
      // address: '+917691008701', // sender's phone number
      // body: 'How are you shadman', // content to match
      // the next 2 filters can be used for pagination
      indexFrom: 0, // start from index 0
      // maxCount: 10, // count of SMS to return each time
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        alert(fail);
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        alert(count);
        // console.log('Count: ', count);
        console.log('List: ', smsList);
        var arr = JSON.parse(smsList);
        const url = 'https://sit.l8r.in/fileupload-service/api/v1/upload';
        const params = {
          mobileNumber: details.mobile_number,
          customerId: details.customer_id.toString(),
          messagesData: arr === [] ? [{}] : arr,
        };
        axios
          .post(url, params, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.props.route.params.tempAuthToken}`,
            },
          })
          .then(res => {
            console.log('sms data', res);
            alert(res.data.statusCode);
            // if(res.status===200){
            //     this.getSMS();
            //     navigation.navigate('Home');
            // //   refRBSheet.current.open();
            // } else {
            //   alert(res.statusText);
            // }
          })
          .catch(err => alert(err));
        // console.log()
        // arr.forEach(function (object) {
        //     console.log('Object: ' + object);
        //     console.log('-->' + object.date);
        //     console.log('-->' + object.body);
        //     // alert('your message with selected id is --->' + object.body)
        // });
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
          }}
          onPress={() => props.navigation.goBack()}>
          <Icon
            style={{fontSize: 24, marginVertical: 12}}
            color={'#000000'}
            name="chevron-back"
          />
        </TouchableOpacity>
        <View style={styles.login}>
          <Text
            style={[
              textStyles.TEXT_1,
              {color: colors.TEXT_COLOR_1, marginBottom: 16},
            ]}>
            Enter your email
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={firstName => this.setState({firstName: firstName})}
              style={[styles.inputs]}
              placeholder="First Name"
              // selectionColor="white"
              // underlineColorAndroid="white"
              keyboardType="email-address"
              placeholderTextColor="#e3e3e3"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={lastName => this.setState({lastName: lastName})}
              style={styles.input}
              placeholder="Last Name"
              // selectionColor="white"
              // underlineColorAndroid="white"
              keyboardType="email-address"
              placeholderTextColor="#e3e3e3"
            />
          </View>
          <View>
            <SelectDropdown
              buttonStyle={styles.inputContainers}
              defaultButtonText="Preferred communication language "
              data={languages}
              onSelect={(selectedItem, index) => {
                console.log('selectedItem', selectedItem, index);
                this.setState({prefLanguage: selectedItem});
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={styles.dont}>Have a referal Code ?</Text>
        </View>
        <TouchableOpacity
          /// onPress={this.myFun}
          style={[styles.buttonContainer, styles.loginButton]}
          // onPress={() => this.props.navigation.navigate('Lcmhome')}
          onPress={() => this.updateUser()}>
          <Text style={styles.loginText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f5',
    paddingHorizontal: 24,
  },
  pic: {
    //height: 300,
    //backgroundColor:'red',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  login: {marginTop: 16},
  inputContainer: {
    width: Dimensions.get('window').width - 48,
    height: 55,
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  inputContainers: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: colors.LIGHT_THEME_BACKGROUND,
  },
  inputs: {
    marginLeft: 10,
    alignItems: 'center',
    fontSize: 15,
  },
  input: {
    height: 45,
    width: '70%',
    fontWeight: 'bold',
    marginLeft: 10,
    alignItems: 'center',
    fontSize: 15,
  },
  Password: {
    top: 20,
    width: 350,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  inputIcon: {
    // width:30,
    //height:30,
    marginLeft: 10,
    justifyContent: 'center',
  },
  remembers: {
    //marginTop: 10,
    flexDirection: 'row',
  },
  RememberMe: {
    height: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 50,
    // backgroundColor: 'transparent',
  },
  btnText: {
    color: '#e3e3e3',
    fontWeight: 'bold',

    fontSize: 15,
  },
  btnForgotPassword: {
    height: 20,
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#2c64e3',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#2c64e3',
    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
  },
  loginButton1: {
    backgroundColor: '#49a0d7',
  },
  loginText: {
    color: '#fff',

    fontWeight: 'bold',
    fontSize: 15,
  },
  FBbtn: {
    width: 160,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#166aa6',
    margin: 10,
  },
  Twtbtn: {
    width: 160,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#0ba4e4',
    margin: 10,
  },

  buttonContainer1: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 165,
    borderRadius: 5,
    backgroundColor: '#166aa6',
    //marginLeft:5
    margin: 10,
    marginTop: 30,
  },
  loginButton1: {
    backgroundColor: 'white',
    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
  },
  loginText1: {
    color: 'white',
  },
  dont: {
    // width: 200,
    //backgroundColor: 'red',
    fontWeight: 'bold',
    color: '#2c64e3',
    fontSize: 13,
  },
  sign: {
    // width: 100,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#2c64e3',
    // borderBottomColor: 'white',
    // borderBottomWidth: 1,
  },
});
export default UserDetailsScreen;
