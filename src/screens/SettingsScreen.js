import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS } from '../constants';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="bell" size={24} color={COLORS.primary} />
            <Text style={styles.settingName}>Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
            <Text style={styles.settingName}>Live Tracking</Text>
          </View>
          <Switch value={liveTracking} onValueChange={setLiveTracking} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="information" size={24} color={COLORS.primary} />
            <Text style={styles.settingName}>App Version</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="help" size={24} color={COLORS.primary} />
            <Text style={styles.settingName}>Help & Support</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.gray} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingName: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
  settingValue: {
    fontSize: 15,
    color: COLORS.gray,
  },
});