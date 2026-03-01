/**
 * Profile Screen
 * Simple user profile and settings
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, List, Switch, Divider } from 'react-native-paper';
import { theme } from '../utils/theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <Title>John Doe</Title>
            <Text style={styles.email}>john@example.com</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          <List.Item
            title="Notifications"
            description="Get alerts for new signals"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={true} />}
          />
          <Divider />
          <List.Item
            title="Paper Trading"
            description="Practice with virtual money"
            left={(props) => <List.Icon {...props} icon="wallet" />}
            right={() => <Switch value={true} />}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            description="Get help or contact support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.h2,
    color: theme.colors.surface,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  settingsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
});
