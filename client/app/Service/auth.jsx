import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';



const authService = {
    normalRegistration : async (userData) =>{
        try {
            const respone = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}auth/registerUser`,userData)
            console.log(respone.data)
            return respone.data
        } catch (error) {
            console.error(error)
            const errorMessage = error.response?.data?.message
             console.log(errorMessage)
            throw new Error(errorMessage)
     
        }
    },
    login: async(email,password) =>{
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}auth/login`,{email,password},{
                headers:{
                    "Content-Type":'application/json'
                }
            })
            
             if(response.data.success === true && response.data.generateToken){
                await AsyncStorage.setItem('UserToken',response.data.generateToken)
                await AsyncStorage.setItem('UserData',JSON.stringify(response.data.getUser))
                console.log()
            }
            console.log(response.data)
            return response.data

        } catch (error) {
             console.error(error)
              const errorMessage = error.response?.data?.message
             console.log(errorMessage)
            throw new Error(errorMessage)
        }
    },
    logout: async() =>{
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}auth/logout`)
            if(response.data.success === true){
                await AsyncStorage.removeItem('UserData')
                await AsyncStorage.removeItem('UserToken')
            }
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}
export default authService