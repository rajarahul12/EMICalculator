import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ResultCard = ({heading, amount, color}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{heading}</Text>
      <View style={[styles.textView, {backgroundColor: color}]}>
        <Text>{`${amount.toFixed(2)} $`}</Text>
      </View>
    </View>
  );
};

export default ResultCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 150,
    width: 200,
    backgroundColor: 'lavender',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
  },
  textView: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
  },
});
