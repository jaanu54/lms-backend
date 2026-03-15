import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const Courses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Programming', 'Database', 'Web Development', 'Mobile'];

  // Expanded instructor map with more ID variations
  const instructorMap = {
    '69b4edbeddd13e32c520fb24': 'Dr. Sarah Johnson',
    '69b4f1ddddd13e32c520fb31': 'Prof. Michael Chen',
    '69b4f1ddddd13e32c520fb31': 'Emily Williams',
    '67b4edbeddd13e32c520fb24': 'Dr. Sarah Johnson',
    '67b4f1ddddd13e32c520fb31': 'Prof. Michael Chen',
    'default': 'Instructor'
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      let data = [];
      try {
        const response = await api.get('/courses');
        console.log('Raw API response:', JSON.stringify(response, null, 2));
        
        if (Array.isArray(response)) {
          data = response;
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data;
        }

        data = data.map(course => {
          // Log each course to see the instructor value
          console.log('Course instructor:', course.instructor);
          
          // Try to get instructor name from populated data or map
          let instructorName = 'Instructor';
          
          // If instructor is populated as an object with name
          if (course.instructor && typeof course.instructor === 'object' && course.instructor.name) {
            instructorName = course.instructor.name;
          } 
          // If instructor is an ID, use the map
          else if (typeof course.instructor === 'string') {
            instructorName = instructorMap[course.instructor] || 
                           instructorMap[course.instructor?.trim()] || 
                           'Instructor';
          }
          
          return {
            ...course,
            instructorName,
            displayDuration: course.duration || 8,
            displayCategory: course.category || 'General',
            displayLevel: course.level || 'Beginner',
            isFree: true
          };
        });
        
        console.log('Processed courses:', data);
      } catch (error) {
        console.log('Using mock data - API error:', error.message);
        data = [
          { 
            _id: '1', 
            title: 'React Advanced', 
            description: 'Master React with hooks',
            instructorName: 'Dr. Sarah Johnson', 
            category: 'Programming',
            duration: 8,
            level: 'advanced',
            displayDuration: 8,
            displayCategory: 'Programming',
            displayLevel: 'advanced',
            isFree: true
          },
          { 
            _id: '2', 
            title: 'MongoDB Mastery', 
            description: 'Complete MongoDB course',
            instructorName: 'Prof. Michael Chen', 
            category: 'Database',
            duration: 6,
            level: 'intermediate',
            displayDuration: 6,
            displayCategory: 'Database',
            displayLevel: 'intermediate',
            isFree: true
          },
          { 
            _id: '3', 
            title: 'JavaScript Basics', 
            description: 'Learn JavaScript from scratch',
            instructorName: 'Emily Williams', 
            category: 'Programming',
            duration: 4,
            level: 'beginner',
            displayDuration: 4,
            displayCategory: 'Programming',
            displayLevel: 'beginner',
            isFree: true
          },
        ];
      }
      setCourses(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{item.title || 'Course'}</Text>
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>FREE</Text>
        </View>
      </View>
      
      <Text style={styles.courseDescription} numberOfLines={2}>
        {item.description || 'No description available'}
      </Text>
      
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="person" size={14} color="#4f46e5" />
          <Text style={styles.metaText}>{item.instructorName}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={14} color="#4f46e5" />
          <Text style={styles.metaText}>{item.displayDuration} weeks</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.badgeText}>{item.displayCategory}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#4f46e5" />
      </View>
      
      <Text style={styles.demoNotice}>⚡ Demo - No payment required</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.activeChip,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.activeChipText,
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.resultsText}>{filteredCourses.length} courses found</Text>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        }
      />
    </View>
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
  },
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeChip: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
  },
  activeChipText: {
    color: '#fff',
  },
  resultsText: {
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#666',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  freeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  categoryBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  demoNotice: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default Courses;