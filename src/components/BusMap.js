import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS, REGIONS } from '../constants';

const { width, height } = Dimensions.get('window');

export default function BusMap({ buses, region, trafficData, onBusSelect }) {
  const mapRef = useRef(null);
  const [selectedBus, setSelectedBus] = useState(null);

  const regionCoords = REGIONS.find(r => r.code === region) || REGIONS[0];

  const initialRegion = {
    latitude: regionCoords.lat,
    longitude: regionCoords.lng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const renderMarker = (bus) => {
    const isSelected = selectedBus?.vehicleNumber === bus.vehicleNumber;
    const speedColor = getSpeedColor(bus.speed || 0);

    return (
      <Marker
        key={bus.vehicleNumber || bus.id}
        coordinate={{
          latitude: bus.lat || regionCoords.lat,
          longitude: bus.lng || regionCoords.lng,
        }}
        title={bus.vehicleNumber || 'Bus'}
        description={`ETA: ${bus.time ? Math.round(bus.time / 60)} min | Speed: ${bus.speed ? bus.speed.toFixed(1)} km/h`}
        onPress={() => {
          setSelectedBus(bus);
          onBusSelect?.(bus);
        }}
      >
        <View style={[styles.markerContainer, isSelected && styles.markerSelected]}>
          <MaterialCommunityIcons
            name="bus"
            size={24}
            color={isSelected ? COLORS.primary : speedColor}
          />
          {isSelected && (
            <Text style={styles.markerLabel}>{bus.vehicleNumber}</Text>
          )}
        </View>
      </Marker>
    );
  };

  const getSpeedColor = (speed) => {
    if (speed < 10) return COLORS.tertiary;
    if (speed < 30) return COLORS.warning;
    return COLORS.success;
  };

  const trafficPolylines = trafficData?.traffic_polyline || [];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={false}
        loadingEnabled={true}
        mapType="standard"
        showsBuildings={true}
        showsPointsOfInterest={true}
        showsTraffic={true}
      >
        {trafficPolylines.map((segment, index) => (
          <Polyline
            key={`traffic-${index}`}
            coordinates={decodePolyline(segment.polyline || '')}
            strokeColor={segment.hexColor || '#FF3B30'}
            strokeWidth={4}
            strokeDashArray={segment.congestion_level === '1' ? [0, 0] : [4, 2]}
            zIndex={2}
          />
        ))}

        {buses.map(renderMarker)}

        {selectedBus && (
          <Marker coordinate={{
            latitude: selectedBus.lat || regionCoords.lat,
            longitude: selectedBus.lng || regionCoords.lng,
          }}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{selectedBus.vehicleNumber || 'Bus'}</Text>
              <Text style={styles.calloutSubtitle}>
                Route: {selectedBus.routeNo || '—'} | ETA: {selectedBus.time ? Math.round(selectedBus.time / 60) + ' min' : '—'}
              </Text>
              <Text style={styles.calloutSubtitle}>
                Speed: {selectedBus.speed ? selectedBus.speed.toFixed(1) + ' km/h' : '—'} | Distance: {selectedBus.distance ? Math.round(selectedBus.distance / 1000) + ' km' : '—'}
              </Text>
              <TouchableOpacity style={styles.calloutButton} onPress={() => setSelectedBus(null)}>
                <Text style={styles.calloutButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Marker>
        )}
      </MapView>

      {selectedBus && (
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <MaterialCommunityIcons name="bus" size={20} color={COLORS.primary} />
            <Text style={styles.infoCardTitle}>{selectedBus.vehicleNumber || 'Bus'}</Text>
          </View>
          <View style={styles.infoCardBody}>
            <Row label="ETA" value={selectedBus.time ? Math.round(selectedBus.time / 60) + ' min' : '—'} />
            <Row label="Speed" value={selectedBus.speed ? selectedBus.speed.toFixed(1) + ' km/h' : '—'} />
            <Row label="Distance" value={selectedBus.distance ? Math.round(selectedBus.distance / 1000) + ' km' : '—'} />
            <Row label="Route" value={selectedBus.routeNo || '—'} />
            <Row label="Direction" value={selectedBus.direction !== undefined ? selectedBus.direction : '—'} />
            <Row label="Status" value={selectedBus.status || 'Operating'} />
            <Row label="Last Update" value={selectedBus.lastServerUpdateTime ? new Date(selectedBus.lastServerUpdateTime).toLocaleTimeString() : '—'} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  markerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  markerSelected: {
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  markerLabel: {
    position: 'absolute',
    top: -16,
    left: -4,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  calloutContainer: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 6,
  },
  calloutSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  calloutButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  calloutButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 8,
  },
  infoCardBody: {
    gap: 8,
  },
});

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function decodePolyline(encoded) {
  if (!encoded) return [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;
  const coordinates = [];

  while (index < len) {
    let result = 1, shift = 0, byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result += (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    result = 1; shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result += (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coordinates;
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rowLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
});