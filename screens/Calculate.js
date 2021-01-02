import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import CustomTextField from '../components/CustomTextField';
import ResultCard from '../components/ResultCard';
import firestore from '@react-native-firebase/firestore';

const Calculate = (props) => {
  const {user} = props.route.params;
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [interest, setInterest] = useState('');
  const [emiAmount, setEMIAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [nickName, setNickName] = useState('');

  const calculateEMI = () => {
    var monthlyInterestRatio = interest / 100 / 12;
    var topNum = Math.pow(1 + monthlyInterestRatio, months);
    var bottomNum = topNum - 1;
    var emi = amount * monthlyInterestRatio * (topNum / bottomNum);
    var full = months * emi;
    var totalInterest = full - amount;
    setEMIAmount(emi);
    setTotalAmount(full);
    setTotalInterest(totalInterest);
  };

  const handleSave = () => {
    firestore().collection(user?.uid).add({
      nickName: nickName,
      amount: amount,
      interest: interest,
      months: months,
      emiAmount: emiAmount,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
    });
    props.navigation.navigate('Home', (initialParams = {user: user}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>Principal Amount</Text>
        <CustomTextField
          value={amount}
          handleChange={(text) => setAmount(parseInt(text))}
          placeholder="Amount in USD"
        />

        <Text>Number of Months</Text>
        <CustomTextField
          value={months}
          handleChange={(text) => setMonths(parseInt(text))}
          placeholder="No.of months"
        />

        <Text>Interest Rate</Text>
        <CustomTextField
          value={interest}
          handleChange={(text) => setInterest(parseFloat(text))}
          placeholder="Interest Rate"
        />

        <TouchableOpacity style={styles.button} onPress={calculateEMI}>
          <Text>Calculate</Text>
        </TouchableOpacity>

        {emiAmount !== '' && (
          <View style={styles.results}>
            <ResultCard
              heading="Monthly EMI"
              amount={emiAmount}
              color="#5cb85b"
            />
            <ResultCard
              heading="Payable Amount"
              amount={totalAmount}
              color="#f0ad4e"
            />
            <ResultCard
              heading="Interest Amount"
              amount={totalInterest}
              color="#5bc0de"
            />
            <CustomTextField
              value={nickName}
              handleChange={(text) => setNickName(text)}
              placeholder="Nick Name"
            />
            <TouchableOpacity
              style={[styles.button, {width: '60%'}]}
              onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calculate;

const styles = StyleSheet.create({
  container: {
    margin: 50,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderColor: '#7bb4ec',
    backgroundColor: '#7bb4ec',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
