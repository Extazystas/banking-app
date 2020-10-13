import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, FlatList, View, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

export default function App() {
  const today = dayjs().format('YYYY-MM-DD');
  const [isLoading, setLoading] = useState(true);
  const [currenciesDay, setCurrenciesDay] = useState(today);
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
    <SafeAreaView style={ styles.wrapper }>
      <View style={ styles.wrapper }>
        <Text style={ styles.text }>
          Сurrencies of Belarusian ruble (<Text style={ styles.boldText }>BYN</Text>) for <Text style={ styles.boldText }>{ currenciesDay }</Text>. Provided by National Bank of the Republic of Belarus
        </Text>

        <Calendar
          hideArrows={ false }
          renderArrow={ (direction) => (direction === 'left' ? <Text>&lt;</Text> : <Text>&gt;</Text>) }
          maxDate={ today }
          futureScrollRange={ 0 }
          style={ {
            borderWidth: 1,
            borderColor: '#000'
          } }
          theme={ {
            calendarBackground: '#a86d67',
            textDayFontSize: 16,
            textMonthFontSize: 15,
            textDayHeaderFontSize: 15,
            textDisabledColor: '#aaa',
            dayTextColor: '#000',
            textDayFontWeight: '600',
            textMonthFontWeight: '600'
          } }
        />

        { isLoading ? <ActivityIndicator /> : (
          currenciesData ? (
            <FlatList
              data={ Object.values(currenciesData.daily_rates) }
              contentContainerStyle={ styles.container }
              keyExtractor={ item => item.cur_abbreviation }
              renderItem={ ({ item }) => {
                return (
                  <View style={ { flexDirection: 'row', marginTop: 5, borderWidth: 1 } }>
                    <Text style={ [styles.text, { width: '30%' }] }>{ item.cur_quot_name }</Text>
                    <Text style={ [styles.text, { width: '30%' }] }>
                      { item.cur_abbreviation }
                    </Text>
                    <Text style={ styles.text }>
                      <Text style={ styles.boldText }>{ item.cur_official_rate }</Text>BYN
                    </Text>
                  </View>
                )
              } }
            />
          ) : <Text style={ styles.notFound }>No currencies found for selected date.</Text>
        ) }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    backgroundColor: '#ccc'
  },
  boldText: {
    fontWeight: 'bold'
  },
  notFound: {
    textAlign: 'center',
    margin: 10,
    fontSize: 20,
    color: 'red'
  },
  text: {
    textAlign: 'center',
    flexDirection: 'column',
    fontSize: 14,
    margin: 10
  },
});
