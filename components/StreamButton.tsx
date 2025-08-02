import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type StreamButtonProps = {
  title: string;
  onPress: () => void;
  isActive: boolean;
  index: number;
};

const StreamButton: React.FC<StreamButtonProps> = ({ title, onPress, isActive, index }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.streamButton, isActive && styles.activeStreamButton]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.streamButtonContent}>
          <Icon
            name="play-circle-outline"
            size={20}
            color={isActive ? '#ffffff' : '#64748b'}
            style={styles.streamIcon}
          />
          <Text style={[styles.streamButtonText, isActive && styles.activeStreamButtonText]}>
            {title}
          </Text>
          {isActive && (
            <View style={styles.activeIndicator}>
              <Icon name="radio-button-checked" size={12} color="#10b981" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  streamButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  activeStreamButton: {
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
  },
  streamButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamIcon: {
    marginRight: 6,
  },
  streamButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeStreamButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeIndicator: {
    marginLeft: 6,
  },
});

export default StreamButton;
