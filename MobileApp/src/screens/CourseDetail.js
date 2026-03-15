import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const CourseDetail = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data || response);
    } catch (error) {
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    setEnrolling(true);
    setTimeout(() => {
      setEnrolling(false);
      Alert.alert('Success', 'Enrolled successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Free Badge */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{course?.title || 'Course Title'}</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {course?.description || 'No description available'}
        </Text>
        
        {/* Instructor & Duration */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="person" size={16} color="#4f46e5" />
            <Text style={styles.metaText}>
              {course?.instructor === '69b4edbeddd13e32c520fb24' ? 'Dr. Sarah Johnson' :
               course?.instructor === '69b4f1ddddd13e32c520fb31' ? 'Prof. Michael Chen' :
               course?.instructor || 'Instructor'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={16} color="#4f46e5" />
            <Text style={styles.metaText}>{course?.duration || 8} weeks</Text>
          </View>
        </View>

        {/* Category & Level */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{course?.category || 'General'}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getLevelColor(course?.level) }]}>
            <Text style={styles.badgeText}>{course?.level || 'Beginner'}</Text>
          </View>
        </View>

        {/* Demo Notice */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>
            ⚡ Demo Project - No payment required
          </Text>
        </View>

        {/* What You'll Learn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          <View style={styles.learnItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.learnText}>Complete course mastery</Text>
          </View>
          <View style={styles.learnItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.learnText}>Hands-on projects</Text>
          </View>
          <View style={styles.learnItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.learnText}>Expert instruction</Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.reqItem}>
            <Ionicons name="ellipse" size={8} color="#666" />
            <Text style={styles.reqText}>Basic programming knowledge</Text>
          </View>
          <View style={styles.reqItem}>
            <Ionicons name="ellipse" size={8} color="#666" />
            <Text style={styles.reqText}>Computer with internet</Text>
          </View>
        </View>

        {/* Enroll Button */}
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={handleEnroll}
          disabled={enrolling}
          activeOpacity={0.8}
        >
          {enrolling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.enrollButtonText}>Enroll Now (Free)</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  freeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  demoContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  demoText: {
    color: '#92400e',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  learnText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reqText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  enrollButton: {
    backgroundColor: '#4f46e5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseDetail;