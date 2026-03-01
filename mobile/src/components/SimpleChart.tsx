/**
 * Simple Chart Component
 * Basic line chart - no overwhelming technical indicators
 * Just shows trend clearly
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../utils/theme';

interface SimpleChartProps {
  data: number[];
  labels?: string[];
}

const screenWidth = Dimensions.get('window').width;

export default function SimpleChart({ data, labels }: SimpleChartProps) {
  // Generate labels if not provided
  const chartLabels = labels || data.map((_, i) => `${i + 1}`);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: chartLabels,
          datasets: [
            {
              data: data,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Indigo
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 64} // Account for margins
        height={200}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`, // Text color
          labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, // Label color
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.colors.primary,
          },
        }}
        bezier // Smooth curves
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withDots={true}
        withShadow={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
});
