/**
 * Signals Screen
 * Simple signal approval interface - one tap to approve
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, Chip, IconButton } from 'react-native-paper';
import { theme } from '../utils/theme';
import { apiService } from '../services/api';
import { wsService } from '../services/websocket';
import HelpTooltip from '../components/HelpTooltip';

export default function SignalsScreen() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    loadSignals();
    connectWebSocket();
  }, []);

  const loadSignals = async () => {
    try {
      const data = await apiService.getSignals();
      setSignals(data || []);
    } catch (error) {
      console.error('Error loading signals:', error);
    }
  };

  const connectWebSocket = () => {
    wsService.connect();
    wsService.on('signal:new', (data: any) => {
      setSignals((prev) => [data, ...prev]);
    });
  };

  const handleApprove = async (signalId: string) => {
    try {
      await apiService.approveSignal(signalId);
      loadSignals();
    } catch (error) {
      console.error('Error approving signal:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Trading Signals</Title>
        <HelpTooltip text="Signals are trading opportunities detected by our system. Review and approve to execute trades." />
      </View>

      {signals.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No signals available</Text>
            <Text style={styles.emptySubtext}>
              New trading signals will appear here
            </Text>
          </Card.Content>
        </Card>
      ) : (
        signals.map((signal) => (
          <Card key={signal.id} style={styles.signalCard}>
            <Card.Content>
              <View style={styles.signalHeader}>
                <View style={styles.signalInfo}>
                  <Text style={styles.instrumentName}>
                    {signal.instrument_name}
                  </Text>
                  <Chip
                    style={[
                      styles.signalTypeChip,
                      {
                        backgroundColor:
                          signal.signal_type === 'buy'
                            ? `${theme.colors.success}20`
                            : `${theme.colors.error}20`,
                      },
                    ]}
                    textStyle={{
                      color:
                        signal.signal_type === 'buy'
                          ? theme.colors.success
                          : theme.colors.error,
                    }}
                  >
                    {signal.signal_type?.toUpperCase()}
                  </Chip>
                </View>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceValue}>
                    {signal.confidence?.toFixed(1)}
                  </Text>
                  <Text style={styles.confidenceLabel}>/10</Text>
                </View>
              </View>

              <View style={styles.signalDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Entry</Text>
                  <Text style={styles.detailValue}>
                    ${signal.entry_price?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Target</Text>
                  <Text style={styles.detailValue}>
                    ${signal.take_profit?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Stop</Text>
                  <Text style={styles.detailValue}>
                    ${signal.stop_loss?.toFixed(2)}
                  </Text>
                </View>
              </View>

              <Text style={styles.reason}>{signal.reason}</Text>

              <View style={styles.actions}>
                <Button
                  mode="contained"
                  onPress={() => handleApprove(signal.id)}
                  style={styles.approveButton}
                  icon="check"
                >
                  Approve Trade
                </Button>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => {}}
                  style={styles.rejectButton}
                />
              </View>
            </Card.Content>
          </Card>
        ))
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  signalCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  signalInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  instrumentName: {
    ...theme.typography.h3,
  },
  signalTypeChip: {
    height: 28,
  },
  confidenceBadge: {
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}10`,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 60,
  },
  confidenceValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  confidenceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  signalDetails: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  reason: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    margin: 0,
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
