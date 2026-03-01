/**
 * Dashboard Screen
 * Main screen showing account overview - simple and clear for novices
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { theme } from '../utils/theme';
import { apiService } from '../services/api';
import { wsService } from '../services/websocket';
import MetricCard from '../components/MetricCard';
import SimpleChart from '../components/SimpleChart';
import HelpTooltip from '../components/HelpTooltip';

export default function DashboardScreen() {
  const [balance, setBalance] = useState(500);
  const [profit, setProfit] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [positions, setPositions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    connectWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [perf, pos] = await Promise.all([
        apiService.getPerformance(),
        apiService.getPositions(),
      ]);
      setProfit(perf?.total_pnl || 0);
      setWinRate(perf?.win_rate || 0);
      setPositions(pos || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const connectWebSocket = () => {
    wsService.connect();
    wsService.on('position:updated', (data: any) => {
      setPositions((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const profitColor = profit >= 0 ? theme.colors.success : theme.colors.error;
  const profitSign = profit >= 0 ? '+' : '';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Account Balance - Big and Clear */}
      <Card style={styles.balanceCard}>
        <Card.Content>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <HelpTooltip
              text="This is your total account value including profits and losses"
            />
          </View>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          
          {/* Profit/Loss - Color Coded */}
          <View style={styles.profitRow}>
            <Text style={[styles.profitText, { color: profitColor }]}>
              {profitSign}${Math.abs(profit).toFixed(2)}
            </Text>
            <Chip
              style={[styles.profitChip, { backgroundColor: `${profitColor}20` }]}
              textStyle={{ color: profitColor }}
            >
              {profitSign}{((profit / (balance - profit)) * 100).toFixed(1)}%
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Key Metrics - Simple Cards */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon="trending-up"
          color={theme.colors.success}
          helpText="Percentage of profitable trades"
        />
        <MetricCard
          label="Open Positions"
          value={positions.length.toString()}
          icon="chart-line"
          color={theme.colors.primary}
          helpText="Number of active trades"
        />
      </View>

      {/* Simple Performance Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Title>Performance</Title>
            <HelpTooltip text="Your trading performance over time" />
          </View>
          <SimpleChart data={[0, 50, 100, 150, 200, profit]} />
        </Card.Content>
      </Card>

      {/* Active Positions - Simple List */}
      <Card style={styles.positionsCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title>Active Positions</Title>
            <HelpTooltip text="Your currently open trades" />
          </View>
          {positions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No open positions</Text>
              <Text style={styles.emptySubtext}>
                Start trading to see your positions here
              </Text>
            </View>
          ) : (
            positions.map((pos) => (
              <View key={pos.id} style={styles.positionItem}>
                <View style={styles.positionInfo}>
                  <Text style={styles.positionName}>{pos.instrument_name}</Text>
                  <Text style={styles.positionType}>
                    {pos.direction === 'buy' ? '📈 Long' : '📉 Short'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.positionPnl,
                    {
                      color:
                        pos.unrealized_pnl >= 0
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}
                >
                  {pos.unrealized_pnl >= 0 ? '+' : ''}
                  ${pos.unrealized_pnl?.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <Button
          mode="contained"
          style={styles.actionButton}
          onPress={() => {}}
          icon="target"
        >
          Set Goal
        </Button>
        <Button
          mode="outlined"
          style={styles.actionButton}
          onPress={() => {}}
          icon="school"
        >
          Learn
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  balanceCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  balanceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  balanceAmount: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  profitText: {
    ...theme.typography.h3,
    fontWeight: '600',
  },
  profitChip: {
    height: 28,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  chartCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  positionsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  positionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  positionInfo: {
    flex: 1,
  },
  positionName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  positionType: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  positionPnl: {
    ...theme.typography.h3,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    margin: theme.spacing.md,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
