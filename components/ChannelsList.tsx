import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Enlace } from '@/types';
import StreamButton from './StreamButton';

type ChannelsListProps = {
  enlaces: Enlace[];
  activeChannel: number;
  activeStream: number;
  onStreamChange: (channelIndex: number, streamIndex: number, url: string) => void;
};

const ChannelsList: React.FC<ChannelsListProps> = ({
  enlaces,
  activeChannel,
  activeStream,
  onStreamChange,
}) => {
  return (
    <ScrollView style={styles.channelsContainer} showsVerticalScrollIndicator={false}>
      {enlaces.map((enlace: Enlace, channelIndex: number) => (
        <View key={channelIndex} style={styles.channelSection}>
          <View style={styles.channelTitleContainer}>
            <Icon name="tv" size={20} color="#3b82f6" style={styles.channelIcon} />
            <Text style={styles.channelTitle} numberOfLines={1} ellipsizeMode="tail">
              {enlace.canal}
            </Text>
            <View style={styles.channelBadge}>
              <Text style={styles.channelBadgeText}>{enlace.m3u8?.length || 0}</Text>
            </View>
          </View>

          <View style={styles.streamsGrid}>
            {enlace.m3u8?.map((url: string, streamIndex: number) => (
              <StreamButton
                key={streamIndex}
                title={`Opción ${streamIndex + 1}`}
                onPress={() => onStreamChange(channelIndex, streamIndex, url)}
                isActive={activeChannel === channelIndex && activeStream === streamIndex}
                index={streamIndex}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  channelsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  channelSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
  },
  channelTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  channelIcon: {
    marginRight: 8,
  },
  channelTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  channelBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelBadgeText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
  },
  streamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});

export default ChannelsList;
