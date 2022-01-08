import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SmsAndroid from 'react-native-get-sms-android';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {check, requestMultiple, PERMISSIONS} from 'react-native-permissions';
import {colors} from '../Styles/Colors';
import {textStyles} from '../Styles/FontStyles';
// import LocationEnabler from 'react-native-location-enabler';
// const {
//     PRIORITIES: { HIGH_ACCURACY },
//     useLocationSettings,
//   } = LocationEnabler;

//   const [enabled, requestResolution] = useLocationSettings({
//     priority: HIGH_ACCURACY, // optional: default BALANCED_POWER_ACCURACY
//     alwaysShow: true, // optional: default false
//     needBle: true, // optional: default false
//   });

const PermissionsScreen = props => {
  const requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Read SMS permission',
          message: 'Fintek access SMS permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the SMS');
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Read Location permission',
          message: 'Fintek access Location permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPhoneStatePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Read Phone state permission',
          message: 'Fintek access Phone state permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the phone state');
      } else {
        console.log('Phone state permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermissions = async () => {
    await requestSMSPermission();
    await requestLocationPermission();
    await requestPhoneStatePermission();
    var allPermissions = true;
    check(PERMISSIONS.ANDROID.READ_SMS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            allPermissions = false;
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            allPermissions = false;
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            allPermissions = false;
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            allPermissions = true;
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            allPermissions = false;
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
    check(PERMISSIONS.ANDROID.READ_PHONE_STATE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            allPermissions = false;
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            allPermissions = false;
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            allPermissions = false;
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            allPermissions = allPermissions && true;
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            allPermissions = false;
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            allPermissions = false;
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            allPermissions = false;
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            allPermissions = false;
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            allPermissions = allPermissions && true;
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            allPermissions = false;
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
    if (allPermissions) {
      // if(!enabled){
      //     requestResolution()
      // }
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          console.log('avsdmhvasd', data);
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch(err => {
          console.log('errrrr', err);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
      //   if (!props.route.params.existUser) {
      props.navigation.navigate(props.route.params.nextScreen, {
        mobile: props.route.params.mobile,
        tempAuthToken: props.route.params.tempAuthToken,
        verification_key: props.route.params.verification_key,
      });
      //   } else {
      //     props.navigation.navigate('Home', {
      //       mobile: props.route.params.mobile,
      //       tempAuthToken: props.route.params.tempAuthToken,
      //       verification_key: props.route.params.verification_key,
      //     });
      //   }
    } else {
      alert('required all permissions');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.login}>
        <Text style={[textStyles.TEXT_1, {color: colors.TEXT_COLOR_1}]}>
          Permissions
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{width: '10%', alignSelf: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: 24, height: 24}}
            resizeMode="contain"
            source={require('../Images/phone_permission.png')}
          />
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
          }}>
          <View style={{width: '60%'}}>
            <Text style={[textStyles.TEXT_3, {color: colors.TEXT_COLOR_1}]}>
              phone state permission
            </Text>
          </View>

          <Text
            style={[
              textStyles.TEXT_9,
              {
                color: colors.LIGHT_THEME_BACKGROUND,
                // textAlign: 'center',
                alignSelf: 'center',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: colors.OPPOSITE_THEME,
              },
            ]}>
            mandatory{' '}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          width: '90%',
        }}>
        <View
          style={{
            width: '10%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}></View>
        <View style={{width: '90%'}}>
          <Text style={[textStyles.TEXT_10, {color: colors.TEXT_COLOR_2}]}>
            we need this permission to ensure the SIM card in your phone and
            your registered phone number match
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{width: '10%', alignSelf: 'center', justifyContent: 'center'}}>
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require('../Images/sms_permission.png')}
          />
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
          }}>
          <View style={{width: '60%'}}>
            <Text style={[textStyles.TEXT_3, {color: colors.TEXT_COLOR_1}]}>
              sms permission
            </Text>
          </View>
          <Text
            style={[
              textStyles.TEXT_9,
              {
                color: colors.LIGHT_THEME_BACKGROUND,
                // textAlign: 'center',
                alignSelf: 'center',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: colors.OPPOSITE_THEME,
              },
            ]}>
            mandatory{' '}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          //   width: '1000%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '10%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}></View>

        <View style={{width: '90%'}}>
          <Text style={[textStyles.TEXT_10, {color: colors.TEXT_COLOR_2}]}>
            we need this permission to verify your phone number, show all of
            your transactions at a single place and assess your credit profile
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          alignSelf: 'center',
        }}>
        <View
          style={{width: '10%', alignSelf: 'center', justifyContent: 'center'}}>
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require('../Images/location_permission.png')}
          />
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
          }}>
          <View style={{width: '60%'}}>
            <Text style={[textStyles.TEXT_3, {color: colors.TEXT_COLOR_1}]}>
              location permission
            </Text>
          </View>
          <Text
            style={[
              textStyles.TEXT_9,
              {
                color: colors.LIGHT_THEME_BACKGROUND,
                // textAlign: 'center',
                alignSelf: 'center',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: colors.OPPOSITE_THEME,
              },
            ]}>
            mandatory{' '}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          //   width: '90%',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: '10%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}></View>

        <View style={{width: '90%'}}>
          <Text style={[textStyles.TEXT_10, {color: colors.TEXT_COLOR_2}]}>
            we need this permission to check eligibility in your area
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 30}}>
        <View style={{width: '20%', justifyContent: 'center'}}>
          <Image
            style={{
              width: 39,
              height: 39,
              alignSelf: 'center',
            }}
            source={require('../Images/safety.png')}
          />
        </View>
        <View style={{width: '70%'}}>
          <Text style={{color: '#b4b6b8'}}>
            Your data is protected with bank grade security
          </Text>
        </View>
      </View>
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          flex: 2,
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
        <TouchableOpacity
          style={[styles.buttonContainer, {backgroundColor: '#2c64e3'}]}
          // onPress={() =>props.navigation.navigate('EmailVerification',{mobile:props.route.params.mobile})}
          onPress={requestPermissions}>
          <Text style={styles.loginText}>Give Permissions</Text>
        </TouchableOpacity>
      </View>
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
    //height: 300,
    //backgroundColor:'red',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  login: {marginTop: 64},
  inputContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    //   borderWidth:2,
    //  borderColor: '#e3e3e3',
    marginTop: 64,
    backgroundColor: '#fff',
  },
  inputs: {
    height: 45,
    width: '70%',
    fontWeight: 'bold',

    alignItems: 'center',
    fontSize: 15,
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
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width - 48,
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
  },
});

export default PermissionsScreen;
