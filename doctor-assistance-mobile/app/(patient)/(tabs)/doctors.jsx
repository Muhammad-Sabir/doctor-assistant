import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import DoctorCard from '@/components/shared/DoctorCard';
import DoctorSearchBar from '@/components/dashboard/DoctorSearchBar';

export default function DoctorsList() {

  const { fetchWithUserAuth } = useAuth();

  const { data, isFetching, isError, error } = useFetchQuery({
    url: 'doctors?average_rating_min=3&average_rating_max=5',
    queryKey: ['topRatedDoctors'],
    fetchFunction: fetchWithUserAuth,
  });

  const topDoctors = data?.results?.sort((a, b) => b.average_rating - a.average_rating).slice(0, 5);

  return (
    <View style={styles.container} className='bg-white'>
      <DoctorSearchBar />
      <Text style={styles.title}>Top Medical Specialists:</Text>

      <View className='z-2'>
        {isFetching ? (
          <Text>Loading....</Text>
        ) : isError ? (
          <Text style={styles.errorText}>Error fetching reviews: {error.message}</Text>
        ) : topDoctors && topDoctors.length > 0 ? (
          <View style={styles.cardContainer}>
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </View>
        ) : (
          <Text style={styles.noDoctorsText}>No top-rated doctors yet.</Text>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3B82F6', // Example primary color
    marginBottom: 16,
    marginTop: 24,
  },
  errorText: {
    color: '#FF0000', // Example error color
  },
  noDoctorsText: {
    color: '#6B7280', // Example gray color
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
