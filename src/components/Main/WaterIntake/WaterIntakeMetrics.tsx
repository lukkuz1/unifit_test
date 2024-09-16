import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Colors from "src/constants/Colors";
import { collection, getDocs } from 'firebase/firestore';
import firebaseServices from 'src/services/firebase';

const { auth, db } = firebaseServices;

const WaterIntakeMetrics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handles weekly, monthly, yearly data fetching
  const fetchData = async (range) => {
    setLoading(true);
    const userUID = auth.currentUser.uid;
    const today = new Date();
    let startDate;

    // Get starting date
    if (range === 'week') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
    } else if (range === 'month') {
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
    } else {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
    }

    const intakeCollectionRef = collection(db, 'user_water', userUID, 'intake');
    const querySnapshot = await getDocs(intakeCollectionRef);

    // Fetch all entries
    const fetchedData = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedData[doc.id] = data.intake_ml || 0;
    });

    // Fill in missing dates with 0
    const dates = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    // Map data
    const results = dates.map((date) => {
      const dateKey = date.toISOString().split('T')[0];
      const intake = fetchedData[dateKey] || 0;
      return { date, intake };
    });

    // Add up data based on range
    let aggregatedData = [];
    if (range === 'year') {
      const tempData = Array(12).fill({ value: 0, label: '' });
      results.forEach(item => {
        const month = item.date.getMonth();
        const index = (month + 12 - (today.getMonth() + 1)) % 12;
        tempData[index] = {
          value: tempData[index].value + item.intake,
          label: item.date.toLocaleDateString('en-CA', { month: 'short' }),
        };
      });
      aggregatedData = tempData;
    } else if (range === 'month') {
      aggregatedData = results.reduce((acc, curr, index) => {
        const weekIndex = Math.floor(index / 7);
        if (!acc[weekIndex]) {
          acc[weekIndex] = { value: 0, label: curr.date.toLocaleDateString('en-CA', { day: 'numeric', month: 'short' }) };
        }
        acc[weekIndex].value += curr.intake;
        return acc;
      }, []);
    } else {
      aggregatedData = results.map((item, index) => {
        const label = item.date.toLocaleDateString('en-CA', { weekday: 'short' });
        return { value: item.intake, label: label };
      });
    }

    setData(aggregatedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const screenWidth = Dimensions.get('window').width;
  const chartSpacing = (screenWidth - 160) / (data.length > 0 ? data.length : 1);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, timeRange === 'week' && styles.activeButton]} onPress={() => setTimeRange('week')}>
          <Text style={styles.buttonText}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, timeRange === 'month' && styles.activeButton]} onPress={() => setTimeRange('month')}>
          <Text style={styles.buttonText}>This Month</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, timeRange === 'year' && styles.activeButton]} onPress={() => setTimeRange('year')}>
          <Text style={styles.buttonText}>This Year</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.BackgroundGradientLower} />
      ) : (
        <LineChart
          data={data}
          width={screenWidth - 160}
          height={300}
          areaChart
          hideDataPoints
          isAnimated
          animationDuration={1200}
          startFillColor={Colors.WaterText}
          startOpacity={1}
          endOpacity={0.3}
          initialSpacing={15}
          spacing={chartSpacing}
          thickness={5}
          yAxisColor={Colors.WaterText}
          showVerticalLines
          verticalLinesColor={Colors.WaterWaveText}
          xAxisColor={Colors.WaterText}
          color={Colors.WaterText}
          xAxisLabelTextStyle={{ color: Colors.Black, transform: [{ rotate: '60deg' }], fontSize: 10 }}
          xAxisLabelsVerticalShift={5}
          yAxisTextStyle={{ color: Colors.Black, fontSize: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "white",
    opacity: 0.96,
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.WaterText,
  },
  activeButton: {
    backgroundColor: Colors.WaterCounterBackground,
  },
  buttonText: {
    color: Colors.WaterText,
    fontWeight: 'bold',
  },
});

export default WaterIntakeMetrics;
