import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingIcon from 'react-native-vector-icons/Entypo';
import ReloadIcon from 'react-native-vector-icons/AntDesign';
import PencilIcon from 'react-native-vector-icons/Foundation';
import OTPTextInput from 'react-native-otp-textinput';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import RNOtpVerify from 'react-native-otp-verify';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import OTPInputView from '@twotalltotems/react-native-otp-input';
// import OTPInputView from './components/react-native-otp-input';
import DeviceInfo from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
// import {Shadow} from 'react-native-neomorph-shadows';
import {colors} from '../Styles/Colors';
import {textStyles} from '../Styles/FontStyles';

const systemVersion = DeviceInfo.getSystemVersion();
const carrier = DeviceInfo.getCarrier().then(carrier => {
  // "SOFTBANK"
  return carrier;
});

const OtpScreen = props => {
  const refRBSheet = useRef();
  const [mobile, setMobile] = useState('');
  const [value, setValue] = useState('');
  const [authentication, setAuthentication] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');
  const [location, setLocation] = useState({});
  const [wrongOtp, setWrongOtp] = useState({});

  wrongOtp;
  const myTimeout = () => {
    setTimeout(() => setAuthentication(true), 3000);
  };

  useEffect(() => {
    setMobile(props.route.params.mobile);
    setVerificationKey(props.route.params.verification_key);
    myTimeout();
  }, []);

  const otpHandler = (message: String) => {
    console.log('message', message);
    const otp = /(\d{4})/g.exec(message)[1];
    console.log('otp', otp);
    setValue(otp ? otp : '');
    RNOtpVerify.removeListener();
  };

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(loc => {
        console.log('location', loc.latitude, loc.longitude);
        setLocation(loc);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
    RNOtpVerify.getOtp()
      .then(p => {
        RNOtpVerify.addListener(otpHandler);
      })
      .catch(p => console.log(p));
    return () => RNOtpVerify.removeListener();
  }, []);

  //   getSMS = () => {
  //     let filter = {
  //         box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
  //         // the next 4 filters should NOT be used together, they are OR-ed so pick one
  //         // read: 0, // 0 for unread SMS, 1 for SMS already read
  //         // _id: 1234, // specify the msg id
  //         address: '+9157575701', // sender's phone number
  //         // body: 'How are you shadman', // content to match
  //         // the next 2 filters can be used for pagination
  //         indexFrom: 0, // start from index 0
  //         // maxCount: 10, // count of SMS to return each time
  //     };
  //     SmsAndroid.list(
  //         JSON.stringify(filter),
  //         (fail) => {
  //             console.log('Failed with this error: ' + fail);
  //         },
  //         (count, smsList) => {
  //             console.log('Count: ', count);
  //             console.log('List: ', smsList);
  //             var arr = JSON.parse(smsList);
  //             // console.log()
  //             // arr.forEach(function (object) {
  //             //     console.log('Object: ' + object);
  //             //     console.log('-->' + object.date);
  //             //     console.log('-->' + object.body);
  //             //     // alert('your message with selected id is --->' + object.body)
  //             // });
  //         },
  //     );
  // }

  const resendOtp = () => {
    if (mobile && mobile !== '' && mobile.length === 10) {
      const url = 'https://sit.l8r.in/profile-service/api/v1/phone/otp';
      const params = {
        // phoneNumber: '+91' + props.route.params.mobile,
        type: 'VERIFICATION',
        hashKey: '+b1g1phabEo',
        deviceSerialNum: getUniqueId(),
      };
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.route.params.tempAuthToken}`,
          },
        })
        .then(res => {
          console.log('ressš', res.data);
          if (res.data.statusCode == 200) {
            setVerificationKey(res.data.Details);
            // navigation.navigate('Otp',{mobile});
            alert('Otp sent to your mobile Number');
          } else {
            alert('failed');
          }
        });
    }
  };

  // const validateOtp1 = () => {
  //   if (value === "") {
  //     refRBSheet.current.open();
  //   } else {
  //     props.navigation.navigate("Permissions");
  //   }
  // }
  const validateOtp = () => {
    if (value && value !== '' && value.length === 4) {
      const url = 'https://sit.l8r.in/profile-service/api/v1/verify/otp';
      const params = {
        otp: value,
        verification_key: verificationKey,
        check: '+91' + mobile,
      };

      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.route.params.tempAuthToken}`,
          },
        })
        .then(async res => {
          console.log('otp resp', res.data);
          if (res.data.statusCode == 200) {
            // EmailVerification
            await createCustomer();
            props.navigation.navigate('EmailVerification', {
              userData: res.data,
              tempAuthToken: props.route.params.tempAuthToken,
            });
            // createCustomerSocial();
          } else {
            alert('failed to login');
            console.log(res.data);
          }
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  const createCustomer = () => {
    const url =
      'https://sit.l8r.in/profile-service/api/v1/customers/create-profile';
    const params = {
      firstName: '',
      lastName: '',
      prefLanguage: '',
      mobileNumber: '+91' + mobile,
      imeiNum: DeviceInfo.getDeviceId(),
      simSerialNum: '2197498274',
      mediaSource: '',
      emailId: '',
      installType: 'NA',
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      listOfApps: [{}],
      loginTime: '',
      noOfSocialFriends: '',
      osName: systemVersion,
      osVersion: systemVersion,
      operatorName: carrier._W,
      subscriberId: carrier._W,
      appVersion: '1.0',
    };

    axios
      .post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.route.params.tempAuthToken}`,
        },
      })
      .then(res => {
        console.log('otp resp', res.data);
        if (res.data.statusCode == 201) {
          alert('success to crete customer');

          // props.navigation.navigate("EmailVerification", { userData: res.data, tempAuthToken: props.route.params.tempAuthToken });
        } else {
          alert('failed to crete customer');
          console.log(res.data);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={[textStyles.TEXT_1, {color: colors.TEXT_COLOR_1}]}>
          Enter the OTP sent to
        </Text>
        <Text
          style={[
            textStyles.TEXT_1,
            {color: colors.MAIN_THEME, marginVertical: 12, fontWeight: 'bold'},
          ]}>
          <Text>8888888888 </Text>
          {/* {props.route.params.mobile} */}
        </Text>
      </View>

      <OTPInputView
        style={{
          width: Dimensions.get('window').width - 48,
          height: 60,
          alignSelf: 'center',
        }}
        pinCount={4}
        keyboardType="number-pad"
        onCodeChanged={code => {
          setValue(code);
        }}
        code={value} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        editable
        autoFocusOnLoad={false}
        codeInputFieldStyle={{
          borderRadius: 5,
          borderWidth: 0,
          color: '#000000',
        }}
        codeInputHighlightStyle={{
          borderRadius: 5,
          borderColor: 'blue',
          color: 'blue',
        }}
        onCodeFilled={code => {
          console.log(`Code is ${code}, you are good to go!`);
        }}
      />
      {/* <OTPTextInput
        // style = {}
        // value={value}
        handleTextChange={val => setValue(val)}
        inputCount={4}
        tintColor="blue"
        offTintColor="grey"
        textInputStyle={{ borderWidth: 0.3, borderBottomWidth: 0.3, borderRadius: 7, borderColor: "red", backgroundColor: "#f3f4f5", margin: 20 }}
      /> */}
      {!authentication ? (
        <View>
          <Text style={[textStyles.TEXT_5, {color: colors.RED, marginTop: 16}]}>
            {!wrongOtp ? 'Wrong Otp' : 'Didn’t receive OTP?'}
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              margin: 8,
              marginLeft: 0,
              alignItems: 'center',
            }}
            onPress={resendOtp}>
            <ReloadIcon size={12} color="#2c64e3" name="reload1" />
            <Text
              style={[
                textStyles.TEXT_5,
                {color: colors.MAIN_THEME, marginLeft: 5},
              ]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              marginLeft: 0,
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('Login')}>
            <PencilIcon size={12} color="#2c64e3" name="pencil" />
            <Text
              style={[
                textStyles.TEXT_5,
                {color: colors.MAIN_THEME, marginLeft: 5},
              ]}>
              Edit mobile number
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <LoadingIcon
            // size={12}
            color="#2c64e3"
            name="circle"
            style={{fontSize: 24, marginRight: 10, fontWeight: 'bold'}}
          />
          <Text
            style={[
              textStyles.TEXT_5,
              {color: colors.TEXT_COLOR_1, marginVertical: 12},
            ]}>
            Auto verifying your mobile number...
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.buttonContainer, {backgroundColor: '#2c64e3'}]}
        onPress={validateOtp}
        // onPress={() => props.navigation.navigate("Permissions")}
      >
        <Text style={styles.loginText}>Verify</Text>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        keyboardAvoidingViewEnabled={true}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={Dimensions.get('window').height * 0.6}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
        }}>
        <View
          style={{
            width: Dimensions.get('window').width * 0.99,
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: 100,
              width: 100,
              marginTop: 32,
              marginBottom: 24,
              alignSelf: 'center',
            }}
            resizeMode="contain"
            source={require('../Images/pending.png')}
          />
          <Text
            style={{
              fontSize: 25,
              width: '80%',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 20,
            }}>
            Verification Required
          </Text>
          <Text style={{fontSize: 12, width: '90%', textAlign: 'center'}}>
            Please click the link sent to your email id
          </Text>
          <Text style={{fontSize: 12, width: '90%', textAlign: 'center'}}>
            <Text style={{color: 'blue'}}>xxxxxxx@gmail.com</Text> to complete
            the verification{' '}
          </Text>
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: '#2c64e3'}]}
            // onPress={closeRBsheet}
            onPress={() => props.navigation.navigate('Permissions')}
            // onPress={() => props.navigation.navigate("UserDetails")}
          >
            <Text style={styles.loginText}>Continue</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              width: '90%',
              marginVertical: 20,
              color: 'red',
              textAlign: 'center',
            }}>
            This email id doesn't belong to me
          </Text>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f5',
    paddingHorizontal: 24,
  },
  gridPad: {
    padding: 50,
    borderWidth: 0,
    borderTopColor: 'white',
    paddingBottom: 10,
    marginBottom: 10,
  },
  txtMargin: {margin: 5},
  inputRadius: {textAlign: 'center'},

  start: {
    color: 'white',
  },
  Health: {
    color: 'white',
    fontSize: 50,
  },
  back: {
    color: 'green',
    width: 120,
  },
  phone: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    padding: 20,
    fontWeight: 'bold',
    fontSize: 25,
  },
  phones: {
    fontSize: 13,
    paddingLeft: 20,
    marginRight: 20,
  },
  backe: {
    margin: 20,
  },
  text: {
    textAlign: 'center',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
  },
  otpBox: {
    padding: 10,
    marginRight: 10,
    height: 45,
    width: 45,
    textAlign: 'center',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: 'white',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
  },
  underlineStyleHighLighted: {
    borderColor: 'white',
  },
  buttonContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width - 48,
    borderRadius: 10,
    // backgroundColor: '#2c64e3',
    marginTop: 16,
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 30,
    width: 280,
    height: 45,
  },
  img: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    marginTop: 10,
  },
  pic: {
    //height: 300,
    //backgroundColor:'red',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  login: {
    // marginHorizontal: 20,
    marginTop: 16,
  },
  inputContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    //   borderWidth:2,
    //  borderColor: '#e3e3e3',
    marginTop: 40,
    backgroundColor: '#fff',
  },
  inputs: {
    height: 45,
    width: '70%',
    fontWeight: 'bold',

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
    color: '#112d52',
    fontSize: 10,
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

export default OtpScreen;
