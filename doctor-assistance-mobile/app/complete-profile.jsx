import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, BackHandler, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const CompleteProfile = () => {

  const { user, logout, completeProfile } = useAuth();

  const [inputErrors, setInputErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    gender: "M",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

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
    completeProfile.mutate(JSON.stringify({ name, date_of_birth: dob, gender }));
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
      { text: 'Exit', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    if (user) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );
      return () => backHandler.remove();
    }
  }, [user]);

  return (
    <CustomKeyboardView>
      <View className="flex-1 px-5 bg-white justify-center">
        <AuthHeaderImage />

        <View className="gap-3">
          <Text className="text-2xl font-bold text-primary">Complete Your Profile</Text>
          <Text className="text-balance text-gray-500 -mt-2">Enter your complete information to continue</Text>

          <View className="gap-4 mt-4">
            <View className="gap-3">
              <Text className="text-black">Name</Text>
              <TextInput
                className={`w-full py-2 px-4 rounded-md border ${inputErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your name"
                value={userDetails.name}
                onChangeText={(value) => handleChange("name", value)}
                onBlur={() => handleBlur("name", userDetails.name)}
              />
              {inputErrors.name && (
                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                  <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                  <Text className='text-sm text-red-500'>{inputErrors.name}</Text>
                </View>
              )}
            </View>

            <View className="gap-3">
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
                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                  <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                  <Text className='text-sm text-red-500'>{inputErrors.birthDate}</Text>
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
                  <View className={`flex-row items-center p-2 `}>
                    <MaterialIcons name={userDetails.gender === "F" ? "radio-button-checked" : "radio-button-unchecked"} size={20} color="hsl(203, 87%, 30%)" />
                    <Text className="ml-2">Female</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3" onPress={handleSubmit}>
            <Text className="text-white font-bold">Submit</Text>
          </Pressable>
        </View>

        <View className="mt-8 mb-8 flex-row justify-center items-center gap-2">
          <Text className="text-center text-gray-500">Thinking of logging out?</Text>
          <Text onPress={logout} className='text-center text-[#045883] font-semibold ' href='/login'>Logout</Text>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default CompleteProfile;
