// Service/auth.js - Fixed version
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from './api'

const authService = {
  normalRegistration: async (userData) => {
    try {
      // Use api instance with relative path
      const response = await api.post(
        'auth/registerUser',  // ✅ Relative path
        userData,
        {
          timeout: 10000,
        }
      );
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  googleAuth:async(googleId,fullname,email,age = null,gender =null) =>{
    try {
      const response = await api.post('auth/google',{
        googleId,fullname,email,age,gender
      })
      console.log('Login response:', response.data);
      if (response.data.success === true && response.data.generate) {
        await AsyncStorage.setItem('UserToken', response.data.generate);
        await AsyncStorage.setItem('UserData', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('isGoogle',JSON.stringify(response.data.googleSignIn))
        console.log('Token and user data saved to AsyncStorage');
      }
      return response.data
    } catch (error) {
       console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  login: async (email, password) => {
    try {
      console.log('Attempting login...');
      console.log('API Base URL:', process.env.EXPO_PUBLIC_API_URL);
      
      // Use api instance (which already has baseURL) with relative path
      const response = await api.post(
        'auth/login',  // ✅ Relative path, not full URL
        { email, password },
        {
          timeout: 10000, // 10 seconds timeout
        }
      );

      console.log('Login response:', response.data);

      // Store token and user data if login successful
      if (response.data.success === true && response.data.generate) {
        await AsyncStorage.setItem('UserToken', response.data.generate);
        await AsyncStorage.setItem('UserData', JSON.stringify(response.data.getUser));
        console.log('Token and user data saved to AsyncStorage');
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response?.data?.message || 'Login failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },
  logout: async () => {
    try {
      // Use api instance with relative path
      const response = await api.post(
        'auth/logout',  // ✅ Relative path
        {},
        {
          timeout: 10000,
        }
      );
      
      // Always clear local storage on logout
      await AsyncStorage.removeItem('UserData');
      await AsyncStorage.removeItem('UserToken');
      await AsyncStorage.removeItem("CheckInData")
      await AsyncStorage.removeItem("backgroundName")
      
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear storage even if request fails
      await AsyncStorage.removeItem('UserData');
      await AsyncStorage.removeItem('UserToken');
      await AsyncStorage.removeItem("CheckInData")
      await AsyncStorage.removeItem("backgroundName")
      
      
      throw error;
    }
  },
  verifyMail:async(email,code)=>{
    try{
    const response = await api.post('auth/verify-email',{email, code },{
      timeout:5000
    })
    return response.data
    }
    catch(error){
      console.error('Logout error:', error);
      throw error
    }
  },
  verifyEmail:async(email)=>{
    try{
    const response = await api.post('auth/changePasswordRequest',{email})
    return response.data
  }
  catch(error){
    console.error(error)
    throw error
  }
},
  verifyPasswordRequestCode:async(email,code)=>{
     try{
    const response = await api.post('auth/verify-request',{email,code})
    return response.data
  }
  catch(error){
    console.error(error)
    throw error
  }
  },
  changePassword:async(password,token) =>{
     try{
    const response = await api.post('auth/changePassword',{password},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    return response.data
  }
  catch(error){
    console.error(error)
    throw error
  }
  }
};

export default authService;