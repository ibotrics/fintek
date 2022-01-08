import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SmsAndroid from 'react-native-get-sms-android';
import {check, requestMultiple, PERMISSIONS} from 'react-native-permissions';
import LocationEnabler from 'react-native-location-enabler';
const {
    PRIORITIES: { HIGH_ACCURACY },
    useLocationSettings,
  } = LocationEnabler;
  
class PermissionsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            isChecked: false,
        };
    }
    
    // componentDidMount = async() =>{
    //     // this.requestPermissions();
    //     // this.getSMS();
    //     await this.requestSMSPermission();
    //     await this.requestLocationPermission();
    //     await this.requestPhoneStatePermission();
    // }

    getSMS = () => {
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
            (fail) => {
                console.log('Failed with this error: ' + fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                console.log('List: ', smsList);
                var arr = JSON.parse(smsList);
                // console.log()
                // arr.forEach(function (object) {
                //     console.log('Object: ' + object);
                //     console.log('-->' + object.date);
                //     console.log('-->' + object.body);
                //     // alert('your message with selected id is --->' + object.body)
                // });
            },
        );
    }


    requestSMSPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: "Read SMS permission",
              message:"Fintek access SMS permission",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the SMS");
          } else {
            console.log("SMS permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Read Location permission",
              message: "Fintek access Location permission",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the Location");
          } else {
            console.log("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      requestPhoneStatePermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            {
              title: "Read Phone state permission",
              message: "Fintek access Phone state permission",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the phone state");
          } else {
            console.log("Phone state permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      requestPermissions = async() =>{
        await this.requestSMSPermission();
        await this.requestLocationPermission();
        await this.requestPhoneStatePermission();
        // console.log("this.props.route.params.mobile",this.props.route.params.mobile)
        // this.props.navigation.navigate('UserDetails',{mobile:this.props.route.params.mobile})
        // requestMultiple([PERMISSIONS.ANDROID.READ_SMS, PERMISSIONS.ANDROID.READ_PHONE_STATE, PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]).then((statuses) => {
        //     console.log('READ_SMS', statuses[PERMISSIONS.ANDROID.READ_SMS]);
        //     console.log('READ_PHONE_STATE', statuses[PERMISSIONS.ANDROID.READ_PHONE_STATE]);
        //     console.log('ACCESS_BACKGROUND_LOCATION', statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]);

        //   });
        //   console.log("PermissionsAndroid.RESULTS.GRANTED",PERMISSIONS)
         var allPermissions = true;
          check(PERMISSIONS.ANDROID.READ_SMS)
            .then((result) => {
                switch (result) {
                case RESULTS.UNAVAILABLE:
                    allPermissions = false;
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    allPermissions = false;
                    console.log('The permission has not been requested / is denied but requestable');
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
            .catch((error) => {
                // …
            });
        check(PERMISSIONS.ANDROID.READ_PHONE_STATE)
            .then((result) => {
                switch (result) {
                case RESULTS.UNAVAILABLE:
                    allPermissions = false;
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    allPermissions = false;
                    console.log('The permission has not been requested / is denied but requestable');
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
            .catch((error) => {
                // …
            });
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                switch (result) {
                case RESULTS.UNAVAILABLE:
                    allPermissions = false;
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    allPermissions = false;
                    console.log('The permission has not been requested / is denied but requestable');
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
            .catch((error) => {
                // …
            });
        if(allPermissions){
            // console.log("allll", this.props.route.params); UserDetails EmailVerification
            // this.props.navigation.navigate('EmailVerification',{mobile:this.props.route.params.mobile, tempAuthToken:this.props.route.params.tempAuthToken, verification_key:res.data.Details});
            if(!this.props.route.params.existUser){
                this.props.navigation.navigate('Otp',{mobile:this.props.route.params.mobile, tempAuthToken:this.props.route.params.tempAuthToken,verification_key:this.props.route.params.verification_key})
            } else {
                this.props.navigation.navigate('Home',{mobile:this.props.route.params.mobile, tempAuthToken:this.props.route.params.tempAuthToken,verification_key:this.props.route.params.verification_key})
            }
        } else {
            alert("required all permissions")
        }
      }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ width: "90%", alignSelf: "center" }}>
                    <View style={{ marginTop: 30 }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Icon style={{ fontSize: 15, }} name="chevron-left" />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.login}>
                        <Text
                            style={{
                                fontSize: 26, marginTop: 50,
                                color: '#000000',
                                fontWeight: 'bold',
                            }}>
                            Permissions
                        </Text>

                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>
                        <Image style={{ width: 24, height: 24 }} source={require('../Images/phone_permission.png')} />
                    </View>
                    <View style={{ width: "90%", flexDirection: "row", justifyContent:"space-between"}}>
                        <View>
                            <Text style={{ fontWeight: "bold", fontSize: 14, justifyContent: "center", color:"rgba(0, 0, 0, 0.85)" }} >phone state permission</Text>
                        </View>
                        <View style={{ width: "30%", }}>
                            <Text style={{ color: "#fff", alignSelf: "center", fontSize: 10, backgroundColor: "black", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>mandatory </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>
                    </View>
                    <View style={{ width: "90%" }}>
                        <Text style={{color:"rgba(37, 37, 37, 0.75)", fontSize:12, lineHeight:22,etterSpacing:0.3}}>we need this permission to ensure the SIM card in your phone and your registered phone number match</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>
                        <Image style={{
                            width: 24, height: 24,
                        }} source={require('../Images/sms_permission.png')}
                        />
                    </View>
                    <View style={{ width: "90%", flexDirection: "row", justifyContent:"space-between" }}>
                        <View >
                            <Text style={{ fontWeight: "bold", fontSize: 14, justifyContent: "center", color:"rgba(0, 0, 0, 0.85)" }} >sms permission</Text>
                        </View>
                        <View style={{ width: "30%", }}>
                            <Text style={{ color: "#fff", alignSelf: "center", fontSize: 10, backgroundColor: "black", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>mandatory </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>

                    </View>

                    <View style={{ width: "90%" }}>
                        <Text style={{color:"rgba(37, 37, 37, 0.75)", fontSize:12, lineHeight:22,etterSpacing:0.3}}>we need this permission to verify your phone number, show all of your transactions at a single place and assess your credit profile</Text>
                    </View>


                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>
                        <Image style={{
                            width: 24, height: 24,
                        }} source={require('../Images/location_permission.png')}
                        />
                    </View>
                    <View style={{ width: "90%", flexDirection: "row", justifyContent:"space-between"}}>
                        <View>
                            <Text style={{ fontWeight: "bold", fontSize: 14, justifyContent: "center", color:"rgba(0, 0, 0, 0.85)" }} >location permission</Text>
                        </View>
                        <View style={{ width: "30%", }}>
                            <Text style={{ color: "#fff", alignSelf: "center", fontSize: 10, backgroundColor: "black", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>mandatory </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, width: "90%", alignSelf: "center", }}>
                    <View style={{ width: "10%", alignSelf: "center", justifyContent: "center" }}>

                    </View>

                    <View style={{ width: "90%" }}>
                        <Text style={{color:"rgba(37, 37, 37, 0.75)", fontSize:12, lineHeight:22, letterSpacing:0.3}}>we need this permission to check eligibility in your area</Text>
                    </View>


                </View>
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop:30 }}>
                        <View style={{ width: "20%",marginLeft:20, justifyContent: "center" }}>
                            <Image style={{
                                width: 39, height: 39, alignSelf: "center",
                            }} source={require('../Images/safety.png')}
                            />
                        </View>
                        <View style={{ width: "70%" }}>
                            <Text style={{color:"#b4b6b8"}}>Your data is protected with bank grade security</Text>
                        </View>
                    </View>
                <View style={{ width: "90%", alignSelf: "center", flex: 2, justifyContent: "flex-end", marginBottom: 20 }}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, {backgroundColor: '#2c64e3'}]}
                        // onPress={() =>this.props.navigation.navigate('EmailVerification',{mobile:this.props.route.params.mobile})}
                    onPress={()=>this.requestPermissions()}
                    >
                        <Text style={styles.loginText}>Give Permissions</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#f3f4f5"
        // paddingHorizontal: 15,
        // justifyContent:'center',
    },
    pic: {
        //height: 300,
        //backgroundColor:'red',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    login: {

    },
    inputContainer: {
        width: "100%",
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        //   borderWidth:2,
        //  borderColor: '#e3e3e3',
        marginTop: 40, backgroundColor: "#fff"
    },
    inputs: {
        height: 45,
        width: "70%",
        fontWeight: "bold",

        alignItems: "center",
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
        color: '#e3e3e3', fontWeight: "bold",

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
        fontWeight: "bold",
        color: '#112d52',
        fontSize: 10,

    },
    sign: {
        // width: 100,
        marginLeft: 10,
        fontWeight: "bold",
        fontSize: 10,
        color: '#2c64e3'
    },
});

export default PermissionsScreen;