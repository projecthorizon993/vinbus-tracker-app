import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS } from '../constants';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    { id: '1', name: 'Route 01A', region: 'hn', stations: 12, eta: '5 min' },
    { id: '2', name: 'Route 03B', region: 'hcm', stations: 15, eta: '12 min' },
  ]);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Saved Routes</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.favoriteRow} onPress={() => removeFavorite(item.id)}>
            <View style={styles.favoriteInfo}>
              <MaterialCommunityIcons name="bus" size={28} color={COLORS.primary} />
              <View style={styles.favoriteDetails}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteMeta}>{item.region.toUpperCase()} • {item.stations} stations</Text>
                <Text style={styles.favoriteETA}>ETA: {item.eta}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="delete" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      {favorites.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="star-off" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>No saved routes</Text>
        </View>
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  favoriteRow: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoriteDetails: {
    marginLeft: 12,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  favoriteMeta: {
    fontSize: 13,
    color: COLORS.gray,
  },
  favoriteETA: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
});