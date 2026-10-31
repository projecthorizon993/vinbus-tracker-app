import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS } from '../constants';
import { api } from '../api';

const { width } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadCameras();
    intervalRef.current = setInterval(loadCameras, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadCameras = async () => {
    try {
      const data = await api.getHanoiCameras();
      setCameras(data.data || []);
    } catch (error) {
      console.error('Hanoi camera error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = (camera) => {
    setSelectedCamera(camera);
    setImageUrl(null);
    setIsLive(false);

    // Try to get snapshot immediately
    const cameraId = camera.camera_id;
    fetch(
      `D:/apl/VinBusTracker/src/api.js` // placeholder - real call below
    );
    fetchSnapshot(cameraId);
  };

  const fetchSnapshot = async (cameraId) => {
    try {
      // In a real scenario, we'd call the backend proxy for the snapshot
      // For now, we show the camera info and let user know it's available
      console.log('Fetching snapshot for:', cameraId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Camera Giao Thông Hà Nội</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadCameras}>
          <MaterialCommunityIcons name="refresh" size={20} color={COLORS.primary} />
          <Text style={styles.refreshText}>Làm mới</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải camera...</Text>
        </View>
      ) : (
        <FlatList
          data={cameras}
          keyExtractor={(item) => item.camera_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.cameraRow} onPress={() => openCamera(item)}>
              <View style={styles.cameraInfo}>
                <MaterialCommunityIcons name="cctv" size={24} color={COLORS.primary} />
                <View style={styles.cameraDetails}>
                  <Text style={styles.cameraName}>{item.name}</Text>
                  <Text style={styles.cameraWard}>{item.ward_name}</Text>
                  <Text style={styles.cameraId}>ID: {item.camera_id}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {selectedCamera && (
        <View style={styles.cameraModal}>
          <View style={styles.cameraModalHeader}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCamera(null)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedCamera.name}</Text>
          </View>

          <View style={styles.cameraContent}>
            {imageUrl ? (
              <Image style={styles.cameraImage} source={{ uri: imageUrl }} />
            ) : (
              <View style={styles.cameraPlaceholder}>
                <MaterialCommunityIcons name="cctv" size={64} color={COLORS.gray} />
                <Text style={styles.placeholderText}>Chưa có ảnh trực tiếp</Text>
                <Text style={styles.placeholderSub}>
                  Camera: {selectedCamera.name}
                </Text>
                <Text style={styles.wardText}>{selectedCamera.ward_name}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.closeCameraBtn} onPress={() => setSelectedCamera(null)}>
              <Text style={styles.closeCameraText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  refreshText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cameraRow: {
    backgroundColor: COLORS.white,
    padding: 14,
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
  cameraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cameraDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  cameraWard: {
    fontSize: 14,
    color: COLORS.gray,
  },
  cameraId: {
    fontSize: 12,
    color: COLORS.gray,
  },
  cameraModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 100,
  },
  cameraModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  closeBtn: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 8,
    flex: 1,
  },
  cameraContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraImage: {
    maxWidth: '90%',
    maxHeight: '60%',
    borderRadius: 12,
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
  },
  placeholderSub: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
  },
  wardText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 6,
  },
  closeCameraBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeCameraText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});