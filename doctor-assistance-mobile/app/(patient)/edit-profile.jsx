import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react-native';

import userIcon from '@/assets/images/user.png';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { useAuth } from '@/contexts/AuthContext';
import banner from "@/assets/images/profileBanner.webp";
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

export default function Profile() {
  const queryClient = useQueryClient();
  const { fetchWithUserAuth, user } = useAuth();

  const [userDetails, setUserDetails] = useState({ name: "", dob: "", gender: "M" });
  const [inputErrors, setInputErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data, isFetching, isError, error } = useFetchQuery({
    url: 'patients/',
    queryKey: ['patientProfile'],
    fetchFunction: fetchWithUserAuth,
  });

  const updateProfileMutation = useCreateUpdateMutation({
    url: `patients/${data?.results[0].id}/`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    fetchFunction: fetchWithUserAuth,
    onSuccessMessage: 'Profile Successfully Updated',
    onErrorMessage: 'Profile Update Failed',
    onSuccess: () => {
      queryClient.invalidateQueries(['patientProfile']);
    }
  });

  const handleChange = (id, value) => {
    setUserDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleBlur = (id, value) => {
    const errors = validateField(id, value, inputErrors);
    setInputErrors(errors);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setUserDetails(prev => ({ ...prev, dob: formattedDate }));
      handleBlur("birthDate", formattedDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasNoFieldErrors(inputErrors)) {
      return;
    }

    console.log(userDetails);
    const { name, dob, gender } = userDetails;
    updateProfileMutation.mutate(JSON.stringify({ name, date_of_birth: dob, gender }));
  };

  useEffect(() => {
    if (data && data.results.length > 0) {
      const patient = data.results[0];
      setUserDetails((prev) => ({
        ...prev, name: patient.name || '', dob: patient.date_of_birth || '', gender: patient.gender || '',
      }));
      setInputErrors({});
    }
  }, [data]);

  if (isFetching) return <Text>Loading....</Text>;
  if (isError) return <Text className="text-red-500">Error: {error.message}</Text>;

  console.log(userDetails);

  return (
    <CustomKeyboardView>
      <View className="flex-1 bg-white mx-1">
        <View style={{ position: 'relative' }}>
          <Image source={banner} style={{ height: 200 }} />
        </View>

        <View className="flex-1 w-full max-w-7xl mx-auto px-5 -mt-20 bg-white rounded-md">
          <View className="flex items-center justify-center mt-4">
            <Image source={userIcon}
              alt={data.name} resizeMode='contain'
              style={{ position: 'absolute', top: -100, height: 150, width: 150, objectFit: 'cover', borderRadius: 100, backgroundColor: 'white' }}
            />
          </View>

          <View className="flex items-center justify-center gap-3 mb-5" style={{ marginTop: 70 }}>
            <View className="items-center">
              <Text className="font-bold text-xl text-primary text-center">{data?.results[0].name}</Text>
              <View className="flex flex-col lg:flex-row lg:gap-3 mt-2 items-center text-sm text-gray-500">
                <View className="flex flex-row items-center gap-2">
                  <Text className='text-gray-500'>{user?.username}</Text>
                </View>
                <View className="flex flex-row items-center mt-2 gap-1">
                  <Text className="text-gray-500">Patient ID: {data?.results[0].id} </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="border-t border-gray-200 my-4" />

          <View>
            <View className="gap-3 mt-3 mb-4">
              <Text className="text-black">Name</Text>
              <TextInput
                className={`w-full py-2 px-4 rounded-md border ${inputErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your name"
                value={userDetails.name}
                onChangeText={(value) => handleChange("name", value)}
                onBlur={() => handleBlur("name", userDetails.name)}
              />
              {inputErrors.name && (
                <View className="flex flex-row items-center text-red-500 text-sm gap-2 -mt-2">
                  <TriangleAlert size={13} color="red" />
                  <Text className='text-sm text-red-500'>{inputErrors.name} </Text>
                </View>
              )}
            </View>

            <View className="gap-3 mb-4">
              <Text className="text-black">Date of Birth</Text>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View className={`w-full py-3 px-4 rounded-md border ${inputErrors.birthDate ? 'border-red-500' : 'border-gray-300'}`}>
                  <Text className={userDetails.dob ? "text-black" : "text-gray-400"}>{userDetails.dob || 'Select your Date of Birth'} </Text>
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={userDetails.dob ? new Date(userDetails.dob) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              {inputErrors.birthDate && (
                <View className="flex flex-row items-center text-red-500 text-sm gap-2 -mt-2">
                  <TriangleAlert size={13} color="red" />
                  <Text className='text-sm text-red-500'>{inputErrors.birthDate} </Text>
                </View>
              )}
            </View>

            <View className="gap-3">
              <Text className="text-black">Gender</Text>
              <View className="flex flex-row -mt-3">
                <Pressable onPress={() => handleChange("gender", "M")}>
                  <View className={`flex-row items-center p-2  mr-3`}>
                    <MaterialIcons name={userDetails.gender === "M" ? "radio-button-checked" : "radio-button-unchecked"} size={20} color="hsl(203, 87%, 30%)" />
                    <Text className="ml-2">Male</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => handleChange("gender", "F")}>
                  <View className={`flex-row items-center p-2`}>
                    <MaterialIcons name={userDetails.gender === "F" ? "radio-button-checked" : "radio-button-unchecked"} size={20} color="hsl(203, 87%, 30%)" />
                    <Text className="ml-2">Female</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity className="bg-primary p-3 rounded-md items-center" style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }} onPress={handleSubmit}>
          <Text className="text-white font-bold">Update</Text>
        </TouchableOpacity>
      </View>
    </CustomKeyboardView>
  );
}
