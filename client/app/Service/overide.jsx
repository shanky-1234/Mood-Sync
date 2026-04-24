import api from "./api";

export const overideService = {
    angerMode: async() =>{
        try{
        const response = await api.post('overide/anger-mode')
        return response.data
        }
       catch(error){
            console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Updating ';
      throw new Error(errorMessage);
        }
    }
}
