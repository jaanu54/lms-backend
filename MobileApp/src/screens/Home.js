import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Instructor name mapping
  const instructorMap = {
    '69b4edbeddd13e32c520fb24': 'Dr. Sarah Johnson',
    '69b4f1ddddd13e32c520fb31': 'Prof. Michael Chen',
    '69b4f1ddddd13e32c520fb31': 'Emily Williams',
    'default': 'Instructor'
  };

  useEffect(() => {
    loadUser();
    fetchData();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const getInstructorName = (instructorId) => {
    return instructorMap[instructorId] || instructorMap.default;
  };

  const fetchData = async () => {
    try {
      let coursesData = [];
      try {
        const response = await api.get('/courses');
        console.log('API Response:', response);
        
        if (Array.isArray(response)) {
          coursesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          coursesData = response.data;
        }
        
        // Map instructor IDs to names
        coursesData = coursesData.map(course => ({
          ...course,
          instructor: getInstructorName(course.instructor),
          displayPrice: course.price || 0,
          displayCategory: course.category || 'General'
        }));
        
      } catch (error) {
        console.log('Using mock data');
        coursesData = [
          { 
            _id: '1', 
            title: 'React Advanced', 
            instructor: 'Dr. Sarah Johnson', 
            price: 79.99, 
            category: 'Programming',
            displayPrice: 79.99,
            displayCategory: 'Programming'
          },
          { 
            _id: '2', 
            title: 'MongoDB Mastery', 
            instructor: 'Prof. Michael Chen', 
            price: 49.99, 
            category: 'Database',
            displayPrice: 49.99,
            displayCategory: 'Database'
          },
          { 
            _id: '3', 
            title: 'JavaScript Basics', 
            instructor: 'Emily Williams', 
            price: 29.99, 
            category: 'Programming',
            displayPrice: 29.99,
            displayCategory: 'Programming'
          },
        ];
      }
      
      setCourses(coursesData);
      setFeaturedCourses(coursesData.slice(0, 3));
      setStats({ enrolled: 3, completed: 1, certificates: 1 });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.courseCardContent}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle} numberOfLines={1}>{item.title || 'Course'}</Text>
          <Text style={styles.courseInstructor}>{item.instructor || 'Instructor'}</Text>
          <View style={styles.courseMeta}>
            <Ionicons name="cash" size={14} color="#4f46e5" />
            <Text style={styles.courseMetaText}>${item.displayPrice || 0}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {(item.displayCategory || 'C').charAt(0)}
          </Text>
        </View>
      </View>
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').charAt(0)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={24} color="#4f46e5" />
          <Text style={styles.statNumber}>{stats.enrolled}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{stats.certificates}</Text>
          <Text style={styles.statLabel}>Certificates</Text>
        </View>
      </View>

      {/* Featured Courses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredCourses.length > 0 ? (
          <FlatList
            data={featuredCourses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        ) : (
          <View style={styles.emptyFeatured}>
            <Text style={styles.emptyText}>No featured courses</Text>
          </View>
        )}
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Enrollments')}
          activeOpacity={0.7}
        >
          <Ionicons name="play-circle" size={30} color="#4f46e5" />
          <Text style={styles.actionText}>Continue Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('Courses')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={30} color="#4f46e5" />
          <Text style={styles.actionText}>Browse Courses</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#4f46e5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
  featuredList: {
    paddingRight: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseMetaText: {
    fontSize: 12,
    color: '#4f46e5',
    marginLeft: 4,
    fontWeight: '500',
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyFeatured: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default Home;