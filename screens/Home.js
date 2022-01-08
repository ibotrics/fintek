import React, { useState } from 'react';
import {
  FlatList, SafeAreaView, View, Text, Image, StyleSheet, Dimensions, TextInput, ScrollView, ImageBackground
} from 'react-native';
import { Neomorph, Shadow } from 'react-native-neomorph-shadows';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchIcon from 'react-native-vector-icons/EvilIcons';
import RightIcon from 'react-native-vector-icons/AntDesign';
const DATA = [
  {
    id: '0',
    title: 'Amazon',
    image: require('../Images/amazon.png'),
    badge: require('../Images/rectangle_3.png'),
    color: "#fa5769"
  },
  {
    id: '1',
    title: 'Flipkart',
    image: require('../Images/flipkart.png'),
    badge: require('../Images/rectangle_3.png'),
    color: "#fae601"
  },
  {
    id: '2',
    title: 'Myntra',
    image: require('../Images/myntra.png'),
    badge: require('../Images/rectangle_3.png'),
    color: "#fa5769"
  },
  {
    id: '3',
    title: 'Nykaa',
    image: require('../Images/nykaa.png'),
    badge: require('../Images/rectangle_3.png'),
    color: "#fa5769"
  },
];

const DATA1 = [
  {
    id: '0',
    title: 'Amazon',
    image: require('../Images/referral_image_1.png'),
    color: "#fa5769"
  },
  {
    id: '1',
    title: 'Flipkart',
    image: require('../Images/referral_image_1.png'),
    color: "#fae601"
  },

];
const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const renderItem = ({ item }) => (
    <View style={{
      backgroundColor: "#ffffff", borderRadius: 5, margin: 10, shadowColor: '#808080',
      width: 90,
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.35,
      elevation: 6
    }}>
      <ImageBackground style={{ height: 15, width: 72, marginLeft: -25, alignSelf: 'center' }} resizeMode="contain" source={item.badge} >
        <Text style={{ fontSize: 8, color: "#ffffff", paddingLeft: 3, fontWeight: "500" }}>Extra 2% discount </Text>
      </ImageBackground>
      <View style={{ padding: 10 }}>
        {/* <View style={{backgroundColor:item.color,padding:2, marginRight:30}}><Text style={{fontSize:8, color:"#ffffff"}}>Extra 2% discount </Text></View> */}
        <Image style={{ height: 50, width: 50, marginVertical: 10, alignSelf: 'center' }} resizeMode="contain" source={item.image} />
        <Text style={{ color: "#000000", fontSize: 12, fontWeight: "500", textAlign: 'center' }}>{item.title}</Text>
      </View>
    </View>
  );

  const renderItem1 = ({ item }) => (
    <View style={{
      backgroundColor: "#ffffff",
      borderRadius: 5,
      margin: 10,
      shadowColor: '#808080',
      width: 221,
      height: 120,
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.35,
      elevation: 6
    }}>
      <ImageBackground style={{ height: 15, width: 72, marginLeft: -25, alignSelf: 'center' }} resizeMode="contain" source={item.badge} >
        <Text style={{ fontSize: 8, color: "#ffffff", paddingLeft: 3, fontWeight: "500" }}>Extra 2% discount </Text>
      </ImageBackground>
      <View style={{ padding: 10 }}>
        {/* <View style={{backgroundColor:item.color,padding:2, marginRight:30}}><Text style={{fontSize:8, color:"#ffffff"}}>Extra 2% discount </Text></View> */}
        <Image style={{ height: 50, width: 50, marginVertical: 10, alignSelf: 'center' }} resizeMode="contain" source={item.image} />
        <Text style={{ color: "#000000", fontSize: 12, fontWeight: "500", textAlign: 'center' }}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ paddingHorizontal: 20, backgroundColor: '#f3f4f5' }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 34, color: "#000000", fontWeight: "800", width: '50%', alignSelf: 'flex-start' }}>Home</Text>
        <Neomorph
          inner // <- enable inner shadow
          useArt // <- set this prop to use non-native shadow on ios
          style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center",
            // shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.12,
            shadowColor: "rgba(255, 255, 255, 0.4)",
            shadowRadius: 5,
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            width: 188,
            height: 38,
            // ...include most of View/Layout styles
          }}
        >

          <View style={{ width: 15, height: 15, borderRadius: 14, backgroundColor: "yellow", marginRight: 20 }} />
          <Text style={{ marginRight: 20 }}>99</Text>
          <Icon name="bell" size={14} color={"#000000"} style={{ marginRight: 20 }} />
          <Image style={{ height: 14, width: 14, borderRadius: 14 }} source={require('../Images/profile.png')} resizeMode="contain" />

        </Neomorph>
      </View>


      <View style={styles.inputContainer}>
        <View style={{ width: "15%", alignItems: "center" }}>
          <SearchIcon size={30} color="#e8ecf0" name="search" />
        </View>
        <TextInput
          onChangeText={value => setSearch(value)}
          // value={mobile}
          style={styles.inputs}
          placeholder="Search"
          selectionColor="white"
          keyboardType="default"
          placeholderTextColor="#e8ecf0"
          maxLength={10}
        />
      </View>

      <View>
        <Image style={{ height: Dimensions.get('window').height * 0.35, width: "100%" }} resizeMode='contain' source={require('../Images/discover_card.png')} />
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
          <View style={{ height: 5, width: 15, borderRadius: 5, backgroundColor: "#000000", marginRight: 10 }} />
          <View style={{ height: 5, width: 5, borderRadius: 5, backgroundColor: "#e8ecf0" }} />
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ fontSize: 16, color: "#6f7276", fontWeight: '500' }}>Shopping</Text>
        <RightIcon size={20} color={"#6f7276"} name="rightcircle" />
      </View>
      <ScrollView>
        <FlatList
          horizontal={true}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ fontSize: 16, color: "#6f7276", fontWeight: '500' }}>Referral</Text>
        <RightIcon size={20} color={"#6f7276"} name="rightcircle" />
      </View>
      <ScrollView>
        <FlatList
          horizontal={true}
          data={DATA1}
          renderItem={renderItem1}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
    width: Dimensions.get('window').width * 0.9,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  inputs: {
    height: 48,
    width: "70%",
    // fontWeight: "bold",
    paddingLeft: 5,
    alignItems: "center",
    // textAlign:"center",
    // marginLeft:30,
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
    width: Dimensions.get('window').width * 0.9,
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

export default HomeScreen;