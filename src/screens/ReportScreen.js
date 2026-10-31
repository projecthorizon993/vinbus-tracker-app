import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Picker,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS } from '../constants';
import { api } from '../api';

export default function ReportScreen({ navigation }) {
  const [reportType, setReportType] = useState('congestion');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const reportTypes = [
    { key: 'congestion', label: 'Đường ùn tắc' },
    { key: 'accident', label: 'Tai nạn giao thông' },
    { key: 'road_closure', label: 'Đường bị đóng kín' },
    { key: 'missing_road', label: 'Thiếu đường trên bản đồ' },
    { key: 'not_allowed', label: 'Vận chuyển cấm' },
    { key: 'other', label: 'Khác' },
  ];

  const submitReport = async () => {
    if (!description.trim()) return;
    setSending(true);

    try {
      const report = await api.submitTrafficReport({
        type: reportType,
        description,
        region: 'hn',
        timestamp: new Date().toISOString(),
      });
      setSent(true);
    } catch (error) {
      console.error('Report error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Báo cáo giao thông</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chọn loại báo cáo</Text>
          <View style={styles.typePicker}>
            {reportTypes.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.typeOption,
                  reportType === item.key && styles.typeOptionSelected,
                ]}
                onPress={() => setReportType(item.key)}
              >
                <Text style={[styles.typeText, reportType === item.key && styles.typeTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả sự cố</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Vui lòng mô tả chi tiết sự cố giao thông..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tiến hành báo cáo</Text>
          <TouchableOpacity
            style={[styles.submitBtn, sending && styles.submitBtnDisabled]}
            onPress={submitReport}
            disabled={sending || !description.trim()}
          >
            {sending ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitText}>Gửi báo cáo</Text>
            )}
          </TouchableOpacity>
        </View>

        {sent && (
          <View style={styles.successCard}>
            <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.success} />
            <Text style={styles.successTitle}>Báo cáo đã gửi thành công</Text>
            <Text style={styles.successSub}>
              Chúng tôi đã ghi nhận thông tin về sự cố giao thông của bạn.
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => setSent(false)}>
              <Text style={styles.doneText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  typePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  typeOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  typeTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  descriptionInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.dark,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#c9c9c9',
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  doneText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});