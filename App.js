import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, FlatList, View } from 'react-native';
import dayjs from 'dayjs';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [currenciesData, setCurrenciesData] = useState([]);
  const today = dayjs().format('YYYY-MM-DD');

  function fetchCountriesData() {
    fetch(`http://127.0.0.1:3000/api/v1/currencies?day=${today}`)
      .then((response) => response.json())
      .then((json) => setCurrenciesData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isLoading) fetchCountriesData();
  })

  return (
    <View style={ { flex: 1, padding: 24 } }>
      { isLoading ? <ActivityIndicator /> : (
        currenciesData ? (
          <FlatList
            data={ Object.values(currenciesData.daily_rates) }
            contentContainerStyle={ styles.container }
            keyExtractor={ item => item.cur_abbreviation }
            renderItem={ ({ item }) => {
              return (
                <View style={ { flex: 1, flexDirection: 'row', margin: 5, borderWidth: 1 } }>
                  <Text style={styles.text}>{ item.cur_quot_name }</Text>
                  <Text style={styles.text}>{ item.cur_abbreviation }</Text>
                  <Text style={styles.text}>{ item.cur_official_rate }</Text>
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
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 20,
    margin: 10
  },
});
