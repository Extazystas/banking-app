import React, { useState } from 'react'
import { TextInput, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const storeToken = async (value) => {
  try {
    await AsyncStorage.setItem('authToken', value)
  } catch (e) {
    console.error(e)
  }
}

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('authToken');

    return value;
  } catch (e) {
    console.error(e);
  }
}

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');

    return true;
  }
  catch (e) {
    console.error(e);
  }
}

function LoginForm(props) {
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (evt) => {
    fetch(`http://127.0.0.1:3000/api/authenticate`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(resp => {
      if (resp.status === 401) throw new Error('Invalid credentials. Unauthorized.')

      return resp.json()
    })
    .then(data => {
      setError('')
      storeToken(data.auth_token)
      props.handleLogin()
    })
    .catch((error) => {
      setError(error.message)
      setEmail('')
      setPassword('')
    })
    setEmail('')
    setPassword('')
  }

  return (
    <KeyboardAvoidingView
      behavior={ Platform.OS == 'ios' ? 'padding' : 'height' }
      style={ { flex: 1 } }
    >
      <View style={ styles.form_container }>
        <Text style={ styles.text }>Please login before continue</Text>
        { error ? <Text style={ styles.error }>{error}</Text> : null }

        <TextInput
          keyboardType='email-address'
          value={ email }
          style={ styles.input }
          autoCorrect={ false }
          placeholder='User Email'
          onChangeText={ text => setEmail(text) }
        />

        <TextInput
          value={ password }
          style={ styles.input }
          autoCorrect={ false }
          secureTextEntry={ true }
          placeholder='Password'
          onChangeText={ text => setPassword(text) }
        />

        <TouchableOpacity onPress={ handleSubmit }>
          <Text style={ styles.submit }>
            Log In
          </Text>
        </TouchableOpacity >
      </View>
    </KeyboardAvoidingView>
  )
}

function LogoutForm(props) {
  return(
    <TouchableOpacity onPress={ props.resetToken }>
      <Text style={ styles.logout_button }>Log Out</Text>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  form_container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ccc',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'left'
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#eee',
    padding: 5,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000'
  },
  submit: {
    fontWeight: 'bold',
    padding: 7,
    borderWidth: 1,
    borderColor: '#000',
    color: '#fff',
    backgroundColor: '#903',
    textAlign: 'center',
    fontSize: 18
  },
  logout_button: {
    marginTop: 5,
    fontWeight: 'bold',
    padding: 7,
    borderWidth: 1,
    borderColor: '#000',
    color: '#fff',
    backgroundColor: '#903',
    textAlign: 'center',
    fontSize: 14
  },
  error: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'red'
  }
});

export { LoginForm, LogoutForm, getToken, removeToken }
