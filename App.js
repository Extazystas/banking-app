import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LoginForm, LogoutForm } from './components/jwt_auth'
import { getToken, removeToken } from './components/token_handler'
import { CalendarWithBankData } from './components/calendar_with_bank_data'

export default function App() {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    handleLogin();
  })

  const handleLogin = () => {
    getToken().then(res => setAuthToken(res));
  }

  const resetToken = () => {
    removeToken();
    setAuthToken(null);
  }

  return (
    <SafeAreaView style={ styles.wrapper }>
      { (authToken !== 'undefined' && authToken !== null) ?
        <View style={ styles.wrapper }>
          <CalendarWithBankData />
          <LogoutForm resetToken={ resetToken } />
        </View> :
        <LoginForm handleLogin={ handleLogin } /> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingLeft: 10,
    paddingRight: 10
  }
});
