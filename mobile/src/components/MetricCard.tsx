/**
 * Metric Card Component
 * Simple card showing a single metric with icon
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../utils/theme';
import HelpTooltip from './HelpTooltip';

interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  color: string;
  helpText?: string;
}

export default function MetricCard({
  label,
  value,
  icon,
  color,
  helpText,
}: MetricCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {helpText && <HelpTooltip text={helpText} />}
        </View>
        <View style={styles.valueRow}>
          <Icon name={icon} size={24} color={color} />
          <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  value: {
    ...theme.typography.h2,
    fontWeight: '700',
  },
});
