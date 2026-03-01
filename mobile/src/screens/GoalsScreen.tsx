/**
 * Goals Screen
 * Simple goal setting with visual progress
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { theme } from '../utils/theme';
import { apiService } from '../services/api';
import HelpTooltip from '../components/HelpTooltip';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeframe, setTimeframe] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await apiService.getGoals();
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const createGoal = async () => {
    try {
      await apiService.createGoal({
        initial_investment: parseFloat(initialInvestment),
        target_amount: parseFloat(targetAmount),
        timeframe_days: parseInt(timeframe),
        risk_tolerance: 'moderate',
      });
      setShowForm(false);
      setInitialInvestment('');
      setTargetAmount('');
      setTimeframe('');
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Create Goal Button */}
      <View style={styles.header}>
        <Button
          mode="contained"
          onPress={() => setShowForm(!showForm)}
          icon={showForm ? 'close' : 'plus'}
        >
          {showForm ? 'Cancel' : 'Set New Goal'}
        </Button>
      </View>

      {/* Goal Form */}
      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Title>Create Trading Goal</Title>
            <TextInput
              label="Starting Amount ($)"
              value={initialInvestment}
              onChangeText={setInitialInvestment}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Target Amount ($)"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Days to Achieve"
              value={timeframe}
              onChangeText={setTimeframe}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={createGoal}
              style={styles.submitButton}
            >
              Create Goal
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Goals List */}
      {goals.map((goal) => {
        const progress = goal.progress?.progress_percentage || 0;
        const daysLeft = goal.progress?.days_remaining || 0;
        const onTrack = goal.progress?.on_track || false;

        return (
          <Card key={goal.id} style={styles.goalCard}>
            <Card.Content>
              <View style={styles.goalHeader}>
                <View>
                  <Text style={styles.goalTitle}>
                    ${goal.initial_investment} → ${goal.target_amount}
                  </Text>
                  <Text style={styles.goalSubtitle}>
                    {goal.timeframe_days} days • {daysLeft} days left
                  </Text>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: onTrack
                        ? `${theme.colors.success}20`
                        : `${theme.colors.warning}20`,
                    },
                  ]}
                  textStyle={{
                    color: onTrack ? theme.colors.success : theme.colors.warning,
                  }}
                >
                  {onTrack ? 'On Track' : 'Behind'}
                </Chip>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressValue}>{progress.toFixed(1)}%</Text>
                </View>
                <ProgressBar
                  progress={progress / 100}
                  color={onTrack ? theme.colors.success : theme.colors.warning}
                  style={styles.progressBar}
                />
              </View>

              <View style={styles.goalInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Daily Target</Text>
                  <Text style={styles.infoValue}>
                    ${goal.requirements?.daily_target?.toFixed(2) || '0.00'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Required Return</Text>
                  <Text style={styles.infoValue}>
                    {goal.requirements?.required_return_pct?.toFixed(1) || '0'}%
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        );
      })}

      {goals.length === 0 && !showForm && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No goals set yet</Text>
            <Text style={styles.emptySubtext}>
              Set a goal to track your trading progress
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
  },
  formCard: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  goalCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  goalTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  goalSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusChip: {
    height: 32,
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  progressValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalInfo: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  emptyCard: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  emptyText: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});
