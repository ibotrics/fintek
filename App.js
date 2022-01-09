import React, {useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import DeviceNumber from 'react-native-device-number';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './screens/Login';
import OtpScreen from './screens/Otp';
import IntroScreen from './screens/Intro';
import HomeScreen from './screens/Home';
import PermissionsScreen from './screens/Permissions';
import UserDetailsScreen from './screens/UserDetails';
import EmailVerificationScreen from './screens/EmailVerification';
import GlobalFont from 'react-native-global-font';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            // options={{ title: 'Welcome' }}
            // Header={null}
          />
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
          />
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    let fontName = 'BasierCircle-Regular';
    GlobalFont.applyGlobal(fontName);
  }, []);

  return <MyStack />;
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
