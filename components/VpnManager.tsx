import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  Text,
  Button,
} from 'react-native';
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn';

const isIPhone = Platform.OS === 'ios';
const PRIMARY_COLOR = '#0627a0';

const VpnManager = () => {
  const [log, setLog] = useState('');
  const logScrollView = useRef<ScrollView>(null);

  useEffect(() => {
    async function observeVpn() {
      if (isIPhone) {
        await RNSimpleOpenvpn.observeState();
      }

      addVpnStateListener((e) => {
        updateLog(JSON.stringify(e));
      });
    }

    observeVpn();

    return async () => {
      if (isIPhone) {
        await RNSimpleOpenvpn.stopObserveState();
      }

      removeVpnStateListener();
    };
  }, []);

  const updateLog = (newLog: unknown) => {
    const now = new Date().toLocaleTimeString();
    setLog((prevLog) => `${prevLog}\n[${now}] ${newLog}`);
  };

  const startOvpn = async () => {
    try {
      await RNSimpleOpenvpn.connect({
        providerBundleIdentifier: '', // Required for iOS
        ovpnFileName: 'a', // or use ovpnConfig with inline config
        compatMode: RNSimpleOpenvpn.CompatMode.OVPN_TWO_THREE_PEER,
      });
    } catch (error) {
      updateLog(error);
    }
  };

  const stopOvpn = async () => {
    try {
      await RNSimpleOpenvpn.disconnect();
    } catch (error) {
      updateLog(error);
    }
  };

  const printVpnState = () => {
    updateLog(JSON.stringify(RNSimpleOpenvpn.VpnState));
  };

  const getVpnState = async () => {
    const state = await RNSimpleOpenvpn.getCurrentState();
    updateLog('Current State: ' + JSON.stringify(state));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Connect" color={PRIMARY_COLOR} onPress={startOvpn} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Disconnect" color={PRIMARY_COLOR} onPress={stopOvpn} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    marginHorizontal: 10,
    minWidth: 120,
  },
  text: {
    color: 'white',
  },
});

export default VpnManager;
