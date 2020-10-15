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

export { storeToken, getToken, removeToken }
