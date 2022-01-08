import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../Styles/Colors';
import {textStyles} from '../Styles/FontStyles';

const v1 =
  'Please click the link sent to your email to complete the verification';
const v2 =
  'Invalid Email. Please provide valid email address for security reasons';
const v3 =
  'This email id is already linked to another mobile number 99xxxxxxx99. Please click on the link sent to the email to proceed ahead';
const EmailVerificationScreen = props => {
  const refRBSheet = useRef();
  const [email, setEmail] = useState('');
  const [verification, setVerification] = useState(false);
  const [data, setData] = useState(null);

  const [userData, setUserData] = useState(null);
  const validateEmail = val => {
    setEmail(val);
    return String(val)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const gotoUserDetails = () => {
    refRBSheet.current.close();
    if (verification) {
      props.navigation.navigate('UserDetails', {
        email,
        userData: props.route.params.userData,
        tempAuthToken: props.route.params.tempAuthToken,
      });
    }
  };
  // const sendVerifyLink = () => {
  //   refRBSheet.current.open();
  // }

  const sendVerifyLink = () => {
    const {
      customer: {details, socialDetails},
    } = props.route.params.userData;
    if (validateEmail(email)) {
      const url = 'https://sit.l8r.in/profile-service/api/v1/send/verifylink';
      const params = {
        customerId: details.customer_id.toString(),
        phoneNumber: details.mobile_number,
        email: email,
        type: 'VERIFICATION',
      };
      console.log('request data', params);
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.route.params.tempAuthToken}`,
          },
        })
        .then(res => {
          console.log('otp resp', res);
          if (res.data.statusCode == 200) {
            setVerification(true);
            refRBSheet.current.open();
            setData(res.data);
          } else {
            setVerification(false);
            refRBSheet.current.open();
            console.log('response fails', res.data);
            // alert(res.statusText);
          }
        });
    } else {
      alert('Enter Correct Email');
    }
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
          Enter your email
        </Text>
      </View>

      <View style={styles.login}>
        <View
          style={{
            width: Dimensions.get('window').width - 48,
            alignSelf: 'center',
          }}>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={value => setEmail(value)}
              style={styles.inputs}
              placeholder="Email"
              selectionColor="#000000"
              keyboardType="email-address"
              placeholderTextColor="#e3e3e3"
              //   maxLength={10}
            />
          </View>
          <Text
            style={[
              textStyles.TEXT_7,
              {color: colors.TEXT_COLOR_2, marginTop: 12},
            ]}>
            To verify your account incase you have changed/lost your mobile
            number and to send monthly credit reports
          </Text>
        </View>
        <TouchableOpacity
          //   disabled={email.length>0}
          style={[
            styles.buttonContainer,
            {backgroundColor: email !== '' ? '#2c64e3' : '#D3D3D3'},
          ]}
          onPress={sendVerifyLink}
          // onPress={() => navigation.navigate("Otp")}
        >
          <Text style={styles.loginText}>Verify</Text>
        </TouchableOpacity>
      </View>
      <RBSheet
        ref={refRBSheet}
        keyboardAvoidingViewEnabled={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
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
        {}
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
            source={
              verification
                ? require('../Images/pending.png')
                : require('../Images/cross.png')
            }
          />
          <Text style={{fontSize: 12, width: '90%', textAlign: 'center'}}>
            {verification ? v1 : v2}
          </Text>
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: '#2c64e3'}]}
            // onPress={() => props.navigation.navigate("UserDetails")}
            onPress={gotoUserDetails}>
            <Text style={styles.loginText}>
              {verification ? 'Continue' : 'Retry'}
            </Text>
          </TouchableOpacity>
          {verification ? (
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                width: '90%',
                marginVertical: 20,
                color: '#2c64e3',
                textAlign: 'center',
              }}>
              Cancel
            </Text>
          ) : null}
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
  pic: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  login: {marginTop: 16},
  inputContainer: {
    width: Dimensions.get('window').width - 48,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputs: {
    height: 48,
    width: '70%',
    fontWeight: 'bold',
    paddingLeft: 5,
    alignItems: 'center',
    marginLeft: 16,
    fontSize: 16,
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
    marginLeft: 10,
    justifyContent: 'center',
  },
  remembers: {
    flexDirection: 'row',
  },
  RememberMe: {
    height: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 50,
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
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width - 48,
    borderRadius: 10,
    backgroundColor: '#2c64e3',
    marginTop: 20,
  },
  loginButton1: {
    backgroundColor: '#49a0d7',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    margin: 10,
    marginTop: 30,
  },

  loginText1: {
    color: 'white',
  },
  dont: {
    fontWeight: 'bold',
    color: '#112d52',
    fontSize: 10,
  },
  sign: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#2c64e3',
  },
});

export default EmailVerificationScreen;
