import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS } from '../constants';
import { api } from '../api';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const searchRoutes = async () => {
    if (!from.trim() || !to.trim()) return;
    setLoading(true);
    try {
      const data = await api.getRouteWithTraffic(
        { lat: 21.0285, lng: 105.8542 },
        { lat: 21.0385, lng: 105.8642 }
      );
      setResults(data?.routes || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Find Route</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={from}
          onChangeText={setFrom}
          placeholderTextColor={COLORS.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={to}
          onChangeText={setTo}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchRoutes}>
          <MaterialCommunityIcons name="magnify" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding route...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.listContainer}>
        {results.map((route, idx) => (
          <TouchableOpacity key={idx} style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeDistance}>{(route.distance / 1000).toFixed(1)} km</Text>
              <Text style={styles.routeDuration}>{Math.round(route.duration / 60)} min</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  backBtn: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.dark,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  routeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeDistance: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  routeDuration: {
    fontSize: 14,
    color: COLORS.gray,
  },
});