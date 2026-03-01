/**
 * Learn Screen
 * Simple educational content for beginners
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../utils/theme';

const topics = [
  {
    id: 'basics',
    title: 'Trading Basics',
    icon: 'book-open-variant',
    description: 'Learn the fundamentals of trading',
  },
  {
    id: 'indicators',
    title: 'Technical Indicators',
    icon: 'chart-line',
    description: 'Understand RSI, MACD, and more',
  },
  {
    id: 'risk',
    title: 'Risk Management',
    icon: 'shield-check',
    description: 'Protect your capital',
  },
  {
    id: 'strategies',
    title: 'Trading Strategies',
    icon: 'lightbulb-on',
    description: 'Proven trading approaches',
  },
];

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Learn Trading</Title>
        <Text style={styles.subtitle}>
          Simple guides to help you get started
        </Text>
      </View>

      {topics.map((topic) => (
        <TouchableOpacity key={topic.id}>
          <Card style={styles.topicCard}>
            <Card.Content>
              <View style={styles.topicRow}>
                <View style={styles.iconContainer}>
                  <Icon name={topic.icon} size={32} color={theme.colors.primary} />
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  size={24}
                  iconColor={theme.colors.textSecondary}
                />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
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
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  topicCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  topicDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
