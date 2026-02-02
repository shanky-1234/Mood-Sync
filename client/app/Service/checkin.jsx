const { default: api } = require("./api")


const checkInService ={
    registerCheckIn : async (data)=>{
    try{
        const respone = await api.post('/checkIn/createCheckIn',data)
        if (respone.data){
            console.log(respone.data)
       }
       return respone.data
    }
    catch(error){
        console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed Updating Checking';
      throw new Error(errorMessage);
    }
},
getTodayChekIn: async()=>{
    try {
        const response = await api.get('/checkIn/getCheckInToday')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed Updating Checking';
      throw new Error(errorMessage);
    }
},
getCheckIn: async()=>{
    try {
        const response = await api.get('/checkIn/getCheckInHistory')
        console.log(response.data)
        return response.data
    } catch (error) {
         console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed Updating Checking';
      throw new Error(errorMessage);
    }
},
getCheckInById:async(id)=>{
    try{
         const response = await api.get(`/checkIn/getCheckIn/${id}`)
        console.log(response.data)
        return response.data
    }
    catch(error){
                 console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed Updating Checking';
      throw new Error(errorMessage);
    }
}

}

export default checkInService

