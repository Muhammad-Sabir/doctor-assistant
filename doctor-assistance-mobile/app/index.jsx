import React from 'react'
import { useRouter } from 'expo-router'
import { Text, View, ImageBackground, Pressable } from 'react-native'

const Welcome = () => {

  const router = useRouter();
  
  return (
    <View className="flex-1">
      <ImageBackground source={require('../assets/images/welcome.jpg')} resizeMode="cover" className="justify-end flex-1 items-center gap-3 p-5">
        <Text className="text-white text-2xl font-bold mb-24">Doctor Assistance</Text>
        <Pressable className="justify-center items-center w-full h-14 rounded-md p-3 bg-primary mb-1" onPress={() => router.push("signIn")}>
          <Text className="color-white text-base">Sign In</Text>
        </Pressable>
        <Pressable className="justify-center items-center w-full h-14 rounded-md p-3 border border-white" onPress={() => router.push("signUp")}>
          <Text className="color-white text-base">Create Account</Text>
        </Pressable>
      </ImageBackground>
    </View>
  )
}

export default Welcome

