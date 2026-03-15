import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // CHANGED
import api from '../services/api';

const Enrollments = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      let data = [];
      try {
        const response = await api.get('/enrollments/student/current');
        if (Array.isArray(response)) {
          data = response;
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data;
        }
      } catch (error) {
        data = [
          {
            id: '1',
            courseTitle: 'React Advanced',
            instructor: 'Dr. Sarah Johnson',
            enrolledDate: '2024-03-01',
            progress: 60,
            status: 'active',
            nextLesson: 'Hooks Deep Dive',
          },
          {
            id: '2',
            courseTitle: 'MongoDB Mastery',
            instructor: 'Prof. Michael Chen',
            enrolledDate: '2024-02-15',
            progress: 100,
            status: 'completed',
            completedDate: '2024-03-10',
            grade: 'A',
          },
        ];
      }
      setEnrollments(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load enrollments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEnrollments();
  };

  const filteredEnrollments = enrollments.filter(e => filter === 'all' || e.status === filter);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.courseTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#10b981' : '#8b5cf6' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="person" size={14} color="#4f46e5" /> {/* CHANGED */}
        <Text style={styles.metaText}>{item.instructor}</Text>
        <Ionicons name="calendar" size={14} color="#4f46e5" style={{ marginLeft: 15 }} /> {/* CHANGED */}
        <Text style={styles.metaText}>{new Date(item.enrolledDate).toLocaleDateString()}</Text>
      </View>
      {item.status === 'active' ? (
        <View>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.nextLesson}>Next: {item.nextLesson}</Text>
        </View>
      ) : (
        <View style={styles.completedRow}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" /> {/* CHANGED */}
          <Text style={styles.completedText}>Completed on {new Date(item.completedDate).toLocaleDateString()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" /> {/* CHANGED */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Enrollments</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        {['all', 'active', 'completed'].map((type) => (
          <TouchableOpacity key={type} style={[styles.filterTab, filter === type && styles.filterTabActive]} onPress={() => setFilter(type)}>
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredEnrollments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book" size={60} color="#ccc" /> {/* CHANGED */}
            <Text style={styles.emptyText}>No enrollments found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#4f46e5', padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', backgroundColor: '#fff', margin: 20, borderRadius: 10, padding: 5 },
  filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 5 },
  filterTabActive: { backgroundColor: '#4f46e5' },
  filterText: { fontSize: 14, color: '#666', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  metaText: { fontSize: 12, color: '#666', marginLeft: 4, marginRight: 15 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  progressLabel: { fontSize: 12, color: '#666' },
  progressPercent: { fontSize: 12, fontWeight: 'bold', color: '#4f46e5' },
  progressBar: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, marginBottom: 10 },
  progressFill: { height: 4, backgroundColor: '#4f46e5', borderRadius: 2 },
  nextLesson: { fontSize: 12, color: '#666', marginTop: 5 },
  completedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  completedText: { fontSize: 12, color: '#666', marginLeft: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
});

export default Enrollments;