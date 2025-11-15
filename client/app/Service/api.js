import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL:process.env.EXPO_PUBLIC_API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use(
    async(config)=>{
        try{
            const token = await AsyncStorage.getItem("UserToken")
            if(token){  //Check Stored Token is valid
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        catch(error){
            console.error(error)
        }
        return config
    },
    (error)=>Promise.reject(error)
)

export default api