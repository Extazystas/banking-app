import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, FlatList, View } from 'react-native';
import dayjs from 'dayjs';
import CurrencyFlag from 'react-currency-flags';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [currenciesDay, setCurrenciesDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [currenciesData, setCurrenciesData] = useState([]);

  function fetchCountriesData() {
    fetch(`http://127.0.0.1:3000/api/v1/currencies?day=${currenciesDay}`)
      .then((response) => response.json())
      .then((json) => setCurrenciesData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isLoading) fetchCountriesData();
  })

  return (
    <View style={ { flex: 1, padding: 50, backgroundColor: '#ccc' } }>
      <Text style={ styles.text }>
        Сurrencies of Belarusian ruble (<b>BYN</b>) for <b>{ currenciesDay }</b>. Provided by <a href='http://nbrb.by' target='_blank'>National Bank of the Republic of Belarus</a>
      </Text>
      { isLoading ? <ActivityIndicator /> : (
        currenciesData ? (
          <FlatList
            data={ Object.values(currenciesData.daily_rates) }
            contentContainerStyle={ styles.container }
            keyExtractor={ item => item.cur_abbreviation }
            renderItem={ ({ item }) => {
              return (
                <View style={ { flex: 0.3, flexDirection: 'row', margin: 5, borderWidth: 1 } }>
                  <Text style={styles.text}>{ item.cur_quot_name }</Text>
                  <Text style={ styles.text }>
                    <CurrencyFlag style={ { marginRight: 5}} currency={ item.cur_abbreviation } size='lg' />
                    { item.cur_abbreviation }
                  </Text>
                  <Text style={ styles.text }><b>{ item.cur_official_rate }</b> BYN</Text>
                </View>
              )}
            }
          />
        ) : <Text>No currencies found for selected date.</Text>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'left',
    backgroundColor: '#ccc'
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 20,
    margin: 10
  },
});
