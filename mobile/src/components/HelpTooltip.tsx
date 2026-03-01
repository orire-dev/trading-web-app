/**
 * Help Tooltip Component
 * Shows "?" icon that displays helpful explanation when tapped
 * Essential for novice users
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton, Portal, Dialog, Text, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../utils/theme';

interface HelpTooltipProps {
  text: string;
  title?: string;
}

export default function HelpTooltip({ text, title = 'What does this mean?' }: HelpTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Icon
          name="help-circle-outline"
          size={18}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{text}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <IconButton
              icon="close"
              onPress={() => setVisible(false)}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
