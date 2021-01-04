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
  Dimensions,
} from 'react-native';
import CustomTextField from '../components/CustomTextField';
import ResultCard from '../components/ResultCard';
import firestore from '@react-native-firebase/firestore';
import {VictoryPie} from 'victory-native';

const Calculate = (props) => {
  const {user} = props.route.params;
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [interest, setInterest] = useState('');
  const [emiAmount, setEMIAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [nickName, setNickName] = useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const windowWidth = Dimensions.get('window').width;

  const calculateEMI = () => {
    if (amount === '' || months === '' || interest === '') {
      return;
    }
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
      timestamp: firestore.FieldValue.serverTimestamp(),
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
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Calculate EMI</Text>
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
            <Text style={{color: 'white'}}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {emiAmount !== '' && (
          <View style={styles.results}>
            <Text style={styles.header}>Results</Text>
            <VictoryPie
              data={[
                {x: 'Principal Amount', y: amount},
                {x: 'Payable Interest', y: totalInterest},
              ]}
              labels={({datum}) =>
                `${((datum.y / totalAmount) * 100).toFixed(0)}%`
              }
              radius={({datum}) =>
                selectedCategory && selectedCategory == datum.x
                  ? windowWidth * 0.4
                  : windowWidth * 0.4 - 10
              }
              animate={{
                duration: 2000,
              }}
              innerRadius={70}
              labelRadius={({innerRadius}) =>
                (windowWidth * 0.4 + innerRadius) / 2.5
              }
              colorScale={['#737373', '#FF615F']}
              style={{
                labels: {
                  fill: 'white',
                  fontFamily: 'Roboto-Regular',
                  lineHeight: 22,
                  fontSize: 16,
                },
                parent: {
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 3,
                },
              }}
              width={windowWidth * 0.8}
              height={windowWidth * 0.8}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: (props) => {
                            let index = props.index;
                            if (index === 0) {
                              setSelectedCategory('Principal Amount');
                            } else {
                              setSelectedCategory('Payable Interest');
                            }
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />

            <View style={styles.categoryParent}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#737373',
                  borderRadius: 5,
                }}
              />
              <Text style={styles.category}>Principal Amount</Text>
            </View>
            <View style={styles.categoryParent}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#FF615F',
                  borderRadius: 5,
                }}
              />

              <Text style={styles.category}>Payable Interest</Text>
            </View>
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
              <Text style={{color: 'white'}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {width: '60%'}]}
              onPress={() =>
                props.navigation.navigate(
                  'Home',
                  (initialParams = {user: user}),
                )
              }>
              <Text style={{color: 'white'}}>Cancel</Text>
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
    margin: 30,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderColor: '#194868',
    backgroundColor: '#194868',
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
  header: {
    fontFamily: 'Roboto-Bold',
    lineHeight: 30,
    fontSize: 22,
    color: '#194868',
    marginBottom: 15,
  },
  categoryParent: {
    marginTop: 5,
    width: Dimensions.get('window').width / 2.5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    marginLeft: 8,
    color: '#194868',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    lineHeight: 22,
  },
});
