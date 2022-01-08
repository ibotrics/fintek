import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import DisplayMode from 'react-native/Libraries/ReactNative/DisplayMode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../Styles/Colors';
import {textStyles} from '../Styles/FontStyles';
const slides = [
  {
    id: 1,
    title: (
      <View style={{marginLeft: 24}}>
        <Text
          style={[
            textStyles.TEXT_1,
            {color: colors.TEXT_COLOR_1, lineHeight: 50},
          ]}>
          One Place
        </Text>
        <Text style={[textStyles.TEXT_1, {color: colors.TEXT_COLOR_1}]}>
          for{' '}
          <Text style={[textStyles.TEXT_1, {color: colors.MAIN_THEME}]}>
            Everything
          </Text>
        </Text>
      </View>
    ),
    text: 'Use LA8R for all your transactions and pay at the end of the month with no extra cost or convert to EMI’s and earn rewards for shopping with your favourite merchants',
    // subText: '*credit limit depends on users credit profile',
    image: require('../Images/onboarding1.png'),
  },
  {
    id: 2,
    title: (
      <View>
        <Text
          style={{
            marginLeft: 24,
            fontSize: RFValue(25, 680),
            fontWeight: 'bold',
            color: '#000000',
          }}>
          Experience a new
        </Text>
        <Text
          style={{
            marginLeft: 24,
            fontSize: RFValue(25, 680),
            fontWeight: 'bold',
            color: '#000000',
          }}>
          way to{' '}
          <Text style={{color: '#2c64e3', fontWeight: 'bold'}}>Shop</Text>
        </Text>
      </View>
    ),
    buleText: 'stop',
    text: 'Gauranteed cashback for every purchase done through LA8R & get more rewards if paid using LA8R pay',
    subText: '',
    image: require('../Images/onboarding2.png'),
  },
  {
    id: 3,
    title: (
      <View>
        <Text
          style={{
            marginLeft: 24,
            fontSize: RFValue(25, 680),
            fontWeight: 'bold',
            color: '#000000',
          }}>
          Pay at Checkout
        </Text>
        <Text
          style={{
            marginLeft: 24,
            fontSize: RFValue(25, 680),
            fontWeight: 'bold',
            color: '#000000',
          }}>
          or get{' '}
          <Text style={{color: '#2c64e3', fontWeight: 'bold'}}>
            Instant Cash Loan
          </Text>
        </Text>
      </View>
    ),
    text: 'You can use your LA8R to pay directly to the merchants  or you can withdraw as cash to your bank account',
    image: require('../Images/onboarding3.png'),
  },
];

const IntroScreen1 = props => {
  const [showRealApp, setShowRealApp] = useState('');
  const [nextTitle, setNextTitle] = useState('Next');
};

export default class IntroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      nextTitle: 'Next',
    };
    // this.isLogin()
  }
  // isLogin = async () => {
  //   var loginStatus = await read("login","false")
  //   console.log("loginStatus", loginStatus)
  //   if(loginStatus == "true"){
  //     this.props.navigation.navigate('Menu')
  //   } else {
  //     this.isEnable()
  //   }
  // }

  componentDidMount = async () => {
    let isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.props.navigation.navigate('Home');
    }
  };

  isEnable = async () => {
    var intro = await read('intro', '0');
    console.log('intro', intro);
    if (intro == '1') {
      this.props.navigation.navigate('Login');
    }
  };

  _renderItem = ({item}) => {
    return (
      <View>
        <SafeAreaView style={{backgroundColor: 'white'}}>
          <ScrollView>
            <View style={styles.container}>
              <View style={{height: Dimensions.get('window').height * 0.5}}>
                <Image
                  style={styles.imges}
                  source={item.image}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  // flexDirection: 'column',
                  // justifyContent: 'space-between',
                  height:
                    Dimensions.get('window').height > 700
                      ? Dimensions.get('window').height * 0.33
                      : Dimensions.get('window').height * 0.3,
                }}>
                <View style={{marginTop: 20}}>{item.title}</View>
                <Text
                  style={[
                    textStyles.TEXT_4,
                    {
                      color: colors.TEXT_COLOR_2,
                      marginLeft: 24,
                      marginRight: 12,
                      marginTop: 10,
                    },
                  ]}>
                  {item.text}
                </Text>
                {/* <Text style={styles.text1}>{item.subText}</Text> */}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  };

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: true});
  };
  _onSkip = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: true});
  };
  _renderNextButton = () => {
    return (
      <View style={[styles.buttonContainer, styles.loginButton]}>
        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {this.state.nextTitle}
        </Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Login');
        }}>
        <View style={[styles.buttonContainer, styles.loginButton]}>
          <Text
            style={{
              color: '#ffffff',
              fontWeight: 'bold',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            Let's Start
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  _renderSkipButton = () => {
    return (
      <TouchableOpacity>
        <View
          style={{
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            margin: 20,
            fontWeight: 'bold',
            width: 50,
            height: 20,
          }}>
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Skip</Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    let settings = {
      accessibility: true,
      dots: this.state.dots,
      infinite: false,
      speed: 500,

      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '100px',
      responsive: [
        {
          breakpoint: 8,
          settings: {
            swipeToSlide: true,
          },
        },
      ],
      onSlideChange: (index, lastIndex) => {
        console.log(index);
        if (index == 0) {
          this.setState({
            // dots: index !== 'yourDesiredSlide',
            nextTitle: 'Next',
          });
        } else if (index == 1 && lastIndex == 0) {
          this.setState({
            // dots: index !== 'yourDesiredSlide',
            nextTitle: 'Next',
          });
        }
        // this.setState({
        //   dots: index !== 'yourDesiredSlide',
        // });
      },
    };
    console.log(
      'device heigh',
      Dimensions.get('window').height,
      Dimensions.get('window').height,
    );
    return (
      <AppIntroSlider
        style={{backgroundColor: 'white'}}
        renderItem={this._renderItem}
        {...settings}
        bottomButton
        data={slides}
        dotStyle={{height: 5, width: 5, backgroundColor: 'gray', marginTop: 10}}
        activeDotStyle={{
          width: 17,
          backgroundColor: '#000000',
          height: 5,
          fontWeight: 'bold',
          marginTop: 10,
        }}
        onDone={() => this.props.navigation.navigate('Signup')}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onPress={() => this.props.navigation.navigate('Signup')}
      />
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#BF9872',
  },
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    // backgroundColor: '#DCDCDC',
  },
  img: {
    alignSelf: 'center',
    marginTop: 40,
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  imges: {
    alignSelf: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    //width:200,height:200,
  },
  titletext: {
    fontFamily: 'BasierCircle-SemiBold',
    width: '40%',
    marginLeft: 24,
    fontSize: RFValue(25, 680),
    fontWeight: '600',
  },
  text: {
    // fontFamily: 'BasierCircle-Medium',
    marginLeft: 24,
    marginRight: 12,
    marginTop: 10,
    // lineHeight: 20,
    color: colors.TEXT_COLOR_2,
    fontSize: RFValue(14, 680),
    fontWeight: '500',
  },
  text1: {
    marginLeft: 24,
    marginRight: 12,
    marginTop: 10,
    color: 'rgba(37, 37, 37, 0.75)',
    fontSize: RFValue(10),
  },
  bottom: {
    width: 320,
    height: 45,
    marginBottom: 20,
    color: 'red',
    backgroundColor: '#e84341',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  skip: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    margin: 20,
    fontWeight: 'bold',
    width: 50,
    height: 20,
  },
  buttonContainer: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width - 32,
    borderRadius: 10,
    backgroundColor: '#2c64e3',
    marginTop: 10,
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
});
