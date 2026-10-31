import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { REGIONS, COLORS, REFRESH_INTERVALS } from '../constants';
import { api } from '../api';
import BusMap from '../components/BusMap';

export default function HomeScreen({ navigation }) {
  const [region, setRegion] = useState('hn');
  const [buses, setBuses] = useState([]);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_INTERVALS.normal);
  const [selectedBus, setSelectedBus] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCachedBusData(region);
      const busList = parseBusData(data);
      setBuses(busList);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, refreshInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [region, fetchData, refreshInterval]);

  const parseBusData = (data) => {
    try {
      if (data.list) return data.list;
      if (Array.isArray(data)) return data;
      if (data.vehicles) return data.vehicles;
      if (data.buses) return data.buses;
      return [];
    } catch (e) {
      return [];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bus Tracking</Text>
        <View style={styles.regionSelector}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r.code}
              style={[styles.regionChip, region === r.code && styles.regionChipActive]}
              onPress={() => setRegion(r.code)}
            >
              <Text style={[styles.regionChipText, region === r.code && styles.regionChipTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <BusMap
        buses={buses}
        region={region}
        trafficData={trafficData}
        onBusSelect={setSelectedBus}
      />

      <View style={styles.busListContainer}>
        <View style={styles.busListHeader}>
          <Text style={styles.busListTitle}>Tracked Buses ({buses.length})</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchData}>
            <MaterialCommunityIcons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={buses}
          keyExtractor={(item) => item.vehicleNumber || item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.busRow}
              onPress={() => setSelectedBus(item)}
            >
              <View style={styles.busRowLeft}>
                <MaterialCommunityIcons
                  name="bus"
                  size={24}
                  color={selectedBus?.vehicleNumber === item.vehicleNumber ? COLORS.primary : COLORS.gray}
                />
              </View>
              <View style={styles.busRowCenter}>
                <Text style={styles.busRowVehicle}>{item.vehicleNumber || 'Unknown'}</Text>
                <Text style={styles.busRowRoute}>
                  Route {item.routeNo || '—'} | {item.status || 'Operating'}
                </Text>
              </View>
              <View style={styles.busRowRight}>
                <Text style={styles.busRowETA}>
                  {item.time ? Math.round(item.time / 60) + ' min' : '—'}
                </Text>
                <Text style={styles.busRowSpeed}>
                  {item.speed ? item.speed.toFixed(1) + ' km/h' : '—'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  regionSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  regionChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  regionChipActive: {
    backgroundColor: COLORS.primary,
  },
  regionChipText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  regionChipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  busListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '45%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  busListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  busListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  refreshBtn: {
    padding: 6,
  },
  busRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F7',
  },
  busRowLeft: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  busRowCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  busRowRight: {
    alignItems: 'flex-end',
    width: 100,
  },
  busRowVehicle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  busRowRoute: {
    fontSize: 13,
    color: COLORS.gray,
  },
  busRowETA: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  busRowSpeed: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});