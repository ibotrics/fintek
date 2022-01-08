import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import querystring from 'query-string-for-all';
import DeviceNumber from 'react-native-device-number';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [tempAuthToken, setTempAuthToken] = useState(null)
  const [isSelected, setIsSelected] = useState(true)

  useEffect(() => {
    getAuthToken();
    getPhone();
  },[]);

  const getPhone = () => {
    if(Platform.OS==="android"){
      DeviceNumber.get().then((res) => {
        setMobile(res.mobileNumber.substring(3));
      })
    }
  }

  const getAuthToken = () => {
    const url = "https://dev.l8r.in/auth/realms/respo-api-realm-local/protocol/openid-connect/token";
    const data = {
      'grant_type': 'password',
      'scope': 'email profile',
      'client_id': 'respo-microservices-local',
      'client_secret': 'fe26670c-43c3-4275-97fc-bb709d716b0b',
      'username': 'profile-api-dev',
      'password': 'password'
    }
    axios.post(url, querystring.stringify(data))
      .then(async (response) => {
        // console.log('userresponse ' + response.data.access_token);
        setTempAuthToken(response.data.access_token);
        await AsyncStorage.setItem("tempAuthToken", response.data.access_token)
      })
      .catch((error) => {
        console.log('error ' + error);
      });
  }

  const reVerification = (customerId) =>{
    if (isSelected && mobile && mobile !== "" && mobile.length === 10) {
      const url = "https://sit.l8r.in/profile-service/api/v1/customers/update/verification";
      const params = {
        phone_number: "+91" + mobile,
        type: "VERIFICATION",
        customerId: customerId,
        mobileVerified:false,
        hashKey:"+b1g1phabEo",
        device_serial_num:getUniqueId()
      }
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${tempAuthToken}`
        } 
      }).then(async res => {
        if(res.data.statusCode==201){
          // await AsyncStorage.setItem("isLoggedIn", "true");
          navigation.navigate('Permissions',{mobile, tempAuthToken, verification_key:res.data.Details,existUser:false});
        } else {
          alert(res.statusText);
        }
        //  console.log("otp resp", res) })
      })
    }
  }

  const getOtp = () => {
    if (isSelected && mobile && mobile !== "" && mobile.length === 10) {
      const url = "https://sit.l8r.in/profile-service/api/v1/phone/otp";
      const params = {
        phoneNumber: "+91" + mobile,
        type: "VERIFICATION",
        hashKey:"+b1g1phabEo",
        deviceSerialNum:getUniqueId()
      }
      console.log("Params", params)
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${tempAuthToken}`
        } 
      }).then(async res => {
        if(res.data.statusCode==200){
          if(res.data.customerId!==null && res.data.email!==null && res.data.firstName!==null){
            await AsyncStorage.setItem("isLoggedIn", "true");
            navigation.navigate('Permissions',{mobile, tempAuthToken, verification_key:res.data.Details, existUser:true});
          } else if(res.data.email!==null && res.data.firstName!==null){
            await AsyncStorage.setItem("isLoggedIn", "true");
            props.navigation.navigate("EmailVerification", { userData: res.data, tempAuthToken});
          } else if(res.data.firstName!==null){
            props.navigation.navigate('UserDetails',{email:res.data.email,userData:res.data, tempAuthToken:props.route.params.tempAuthToken});  
          }
          if(res.data.customerId>0){
            await AsyncStorage.setItem("isLoggedIn", "true");
            navigation.navigate('Permissions',{mobile, tempAuthToken, verification_key:res.data.Details, existUser:true});
          } else {
            navigation.navigate('Permissions',{mobile, tempAuthToken, verification_key:res.data.Details, existUser:false});
          }
          console.log("status", res.data)
        } else if(res.data.statusCode==400){
          Alert.alert(
            "Device Not Matched",
            res.data.Details,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => reVerification(res.data.customerId) }
            ]
          );
        } else {
          alert(res.statusText);
        }
        //  console.log("otp resp", res) })
      })
    }
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity style={{width:48, height:48, alignItems:"center", justifyContent:"center"}} onPress={() => navigation.navigate('Intro')}>
          <Icon style={{ fontSize: 24 }} name="chevron-back" />
        </TouchableOpacity>
      </View>
      <View style={{ width: Dimensions.get('window').width*0.9,  alignSelf: "center" }}>
        
        <View style={styles.login}>
          <Text
            style={{
              fontSize: 28, marginTop: 30,
              color: '#000000',
              fontWeight: 'bold',
            }}>
            Welcome.
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginVertical:10,
              color: '#000000',
              fontWeight: 'bold',
            }}>
            Enter you mobile number
          </Text>
          <View style={styles.inputContainer}>
            <View style={{ width: "15%" , flexDirection:'column', alignItems:"center"}}>
              <View style={{backgroundColor:"#ff7337", height:8, width:21}}/>
              <View style={{backgroundColor:"while", height:8, width:21}}/>
              <View style={{backgroundColor:"#18c03d", height:8, width:21}}/>
            </View>
            <Text style={{fontSize:16, color:"#000000"}}>+91</Text>
            <TextInput
              onChangeText={value => setMobile(value)}
              value={mobile}
              style={styles.inputs}
              placeholder="Mobile Number"
              selectionColor="white"
              keyboardType="number-pad"
              placeholderTextColor="#e3e3e3"
              maxLength={10}
            />
          </View>
        </View>
        <View style={{flexDirection:"row", marginTop: 20, alignItems:"center"}}>
          <CheckBox
            isChecked={isSelected}
            onClick={()=>setIsSelected(!isSelected)}
          />
            <Text style={[styles.sign, {color:"rgba(0, 0, 0, 0.85)"}]}>By signing up, you agree to the <Text style={styles.sign}>Terms of Service and Privacy Policy</Text></Text>
        </View>
        <TouchableOpacity
          disabled={!isSelected}
          style={[styles.buttonContainer,{backgroundColor: isSelected && mobile.length===10 ? "#2c64e3" : "#D3D3D3"}]}
          onPress={getOtp}
          // onPress={() => navigation.navigate("Otp")}
        >
          <Text style={styles.loginText}>Get OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#f3f4f5"
  },
  pic: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  login: {

  },
  inputContainer: {
    width: Dimensions.get('window').width*0.9,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 40,
    backgroundColor: "#fff"
  },
  inputs: {
    height: 48,
    width: "70%",
    fontWeight: "bold",
    paddingLeft: 5,
    alignItems: "center",
    // textAlign:"center",
    marginLeft:30,
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
    flexDirection: 'row'
  },
  RememberMe: {
    height: 17,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 50
  },
  btnText: {
    color: '#e3e3e3', fontWeight: "bold",

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
    width: Dimensions.get('window').width*0.9,
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
    fontWeight: "bold",
    color: '#112d52',
    fontSize: 10,

  },
  sign: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 10,
    color: '#2c64e3'
  },
});

export default LoginScreen;